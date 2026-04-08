/**
 * Mock Map Server.
 *
 * Responsibilities:
 * 1. Accept GET/POST/… requests from the web application under test.
 * 2. Match them against a queue of pre-planned expectations.
 * 3. Log every received request for later inspection.
 * 4. Expose admin endpoints (prefixed /__mock/) for the test runner.
 */

import http from 'node:http'
import { URL } from 'node:url'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import type {
  CreateExpectationPayload,
  MockExpectation,
  MockResponse,
  ReceivedRequest,
  RequestMatcher,
} from './types'
import { DEFAULT_TTL_MS } from './types'
import { BLUE_TILE, GREEN_TILE } from './png'

// ### File logger ############################################################

const LOG_FILE = path.resolve(
  process.cwd(),
  'test-results',
  'map-mock-service-log.txt'
)
let logStream: fs.WriteStream | null = null

/**
 * Creates the append-mode log stream used by the mock server file logger.
 */
function ensureLogStream(): void {
  if (!logStream) {
    logStream = fs.createWriteStream(LOG_FILE, { flags: 'a' })
  }
}

/**
 * Appends one structured log line to the mock server log file with a timestamp and request tag.
 * This is used to trace expectations and incoming map requests during test runs.
 *
 * @param tag - Short category for the log entry such as "expect" or the HTTP method.
 * @param params - Preformatted key-value details that describe the event payload.
 */
function logToFile(tag: string, params: string): void {
  ensureLogStream()
  const timestamp = new Date().toISOString()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  logStream!.write(`[${timestamp}][${tag}] -> [${params}]\n`)
}

// ### State ##################################################################

/** Ordered list of expected requests. */
let expectations: MockExpectation[] = []

/** All received requests (chronological). */
let receivedRequests: ReceivedRequest[] = []

/** Fallback response when no expectation matches. Default is a blue PNG tile. */
let fallbackResponse: MockResponse = {
  status: 200,
  body: BLUE_TILE,
  headers: { 'Content-Type': 'image/png' },
}

// ### Helpers ################################################################

/**
 * Removes expired expectations and received requests from in-memory state using TTL cutoffs.
 */
function pruneStaleEntries(): void {
  const now = Date.now()
  expectations = expectations.filter((e) => now - e.createdAt < e.ttlMs)
  receivedRequests = receivedRequests.filter(
    (r) => now - r.receivedAt < DEFAULT_TTL_MS
  )
}

/**
 * Parses a request URL and returns all query parameters as a flat string record.
 * The base URL is only used so relative paths can be parsed safely by `URL`.
 *
 * @param url - Incoming request URL (path with optional query string) to parse.
 * @param base - Base origin used by the URL parser for relative request paths.
 * @returns A map of query parameter keys to their string values.
 */
function parseQuery(url: string, base: string): Record<string, string> {
  const parsed = new URL(url, base)
  const query: Record<string, string> = {}
  parsed.searchParams.forEach((value, key) => {
    query[key] = value
  })
  return query
}

/**
 * Compares an actual request value against an expected matcher value.
 * Supports exact string comparison and regular expression testing.
 *
 * @param actual - Runtime value extracted from the request, or undefined if missing.
 * @param expected - Expected matcher value as a literal string or `RegExp`.
 * @returns `true` when the actual value satisfies the expected matcher.
 */
function matchesValue(
  actual: string | undefined,
  expected: string | RegExp
): boolean {
  if (actual === undefined) return false
  if (typeof expected === 'string') return actual === expected
  return expected.test(actual)
}

/**
 * Checks whether an incoming request satisfies all parts of a configured matcher.
 * Method, URL, query values, and header constraints must all pass for a match.
 *
 * @param matcher - Matcher definition describing expected URL/method/query/header values.
 * @param method - Incoming HTTP method received by the mock server.
 * @param url - Incoming request URL used for path and regex matching.
 * @param query - Parsed query parameter map from the incoming URL.
 * @param headers - Normalized request headers captured from the incoming request.
 * @returns `true` when the request fully matches the provided matcher.
 */
function matchesRequest(
  matcher: RequestMatcher,
  method: string,
  url: string,
  query: Record<string, string>,
  headers: Record<string, string>
): boolean {
  // method check
  const expectedMethod = matcher.method ?? 'GET'
  if (method.toUpperCase() !== expectedMethod.toUpperCase()) return false

  // URL check
  if (typeof matcher.url === 'string') {
    // for string matchers the request path must start with or equal the matcher url
    const parsedUrl = new URL(url, 'http://localhost')
    if (
      !parsedUrl.pathname.includes(matcher.url) &&
      !url.includes(matcher.url)
    ) {
      return false
    }
  } else if (!matcher.url.test(url)) {
    return false
  }

  // query params check
  if (matcher.query) {
    for (const [key, expected] of Object.entries(matcher.query)) {
      if (!matchesValue(query[key], expected)) return false
    }
  }

  // headers check
  if (matcher.headers) {
    const lowerHeaders: Record<string, string> = {}
    for (const [k, v] of Object.entries(headers)) {
      lowerHeaders[k.toLowerCase()] = v
    }
    for (const [key, expected] of Object.entries(matcher.headers)) {
      if (!matchesValue(lowerHeaders[key.toLowerCase()], expected)) {
        return false
      }
    }
  }

  return true
}

/**
 * Returns the first expectation that matches the incoming request details.
 * Expectation order is respected.
 *
 * @param method - Incoming HTTP method used for matcher evaluation.
 * @param url - Incoming request URL to test against expectation URL rules.
 * @param query - Parsed request query parameters used by query matchers.
 * @param headers - Incoming request headers used by header matchers.
 * @returns The first matching expectation, or `undefined` when no match exists.
 */
function findMatchingExpectation(
  method: string,
  url: string,
  query: Record<string, string>,
  headers: Record<string, string>
): MockExpectation | undefined {
  return expectations.find((exp) =>
    matchesRequest(exp.matcher, method, url, query, headers)
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 * Sends a JSON response with CORS headers for admin endpoints.
 * This helper keeps admin handler responses consistent and compact.
 *
 * @param res - Node HTTP response object to write to.
 * @param data - Serializable payload to send as JSON.
 * @param status - HTTP status code to return (defaults to 200).
 */
function sendJson(res: http.ServerResponse, data: unknown, status = 200): void {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  })
  res.end(JSON.stringify(data))
}

/**
 * Sends a mock response object as a real HTTP response.
 * It handles body serialization and default CORS headers automatically.
 *
 * @param res - Node HTTP response object to write the final status, headers, and body.
 * @param mockRes - Mock response definition containing status, headers, body, and optional delay.
 */
function sendMockResponse(
  res: http.ServerResponse,
  mockRes: MockResponse
): void {
  const status = mockRes.status ?? 200
  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    ...(mockRes.headers ?? {}),
  }

  let body: string | Buffer
  if (Buffer.isBuffer(mockRes.body)) {
    body = mockRes.body
  } else if (typeof mockRes.body === 'object' && mockRes.body !== null) {
    body = JSON.stringify(mockRes.body)
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }
  } else {
    body = (mockRes.body as string) ?? ''
  }

  res.writeHead(status, headers)
  res.end(body)
}

/**
 * Reads and concatenates the raw request body from a Node incoming message.
 * This is used for admin payload parsing and non-GET map request capture.
 *
 * @param req - Node HTTP incoming request stream to read from.
 * @returns A promise resolving to the UTF-8 request body string.
 */
function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString()))
  })
}

/**
 * Recursively restores serialized regex marker objects into real `RegExp` instances.
 * This allows matcher payloads sent over JSON to preserve regex behavior.
 * Expectations are sent as { url: { __regexp: "pattern", __flags: "i" } }
 *
 * @param obj - Parsed JSON value that may contain nested regex marker objects.
 * @returns The same value tree with marker objects converted to `RegExp` where applicable.
 */
function reviveRegExp(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj
  if (typeof obj !== 'object') return obj

  const rec = obj as Record<string, unknown>
  if ('__regexp' in rec && typeof rec.__regexp === 'string') {
    return new RegExp(rec.__regexp, (rec.__flags as string) ?? '')
  }

  for (const key of Object.keys(rec)) {
    rec[key] = reviveRegExp(rec[key])
  }
  return rec
}

/**
 * Logs newly registered expectations to both console output and the test log file.
 * The log entry includes matcher details and whether a custom response was provided.
 *
 * TODO: response needs a summary string to be able to log it properly.
 * 'custom' may not be enough to distinguish different expectations in the logs.
 *
 * @param expectation - Materialized expectation stored in server state with generated metadata.
 * @param payload - Original payload received from the admin API when creating the expectation.
 */
function logExpectation(
  expectation: MockExpectation,
  payload: CreateExpectationPayload
): void {
  // eslint-disable-next-line no-console
  console.log(
    `[MockMapServer] Expectation registered: ${expectation.id}`,
    payload.response ? '(custom response)' : '(auto green tile)'
  )
  logToFile(
    'expect',
    `id=${expectation.id} ` +
      `url=${JSON.stringify(payload.matcher.url)} ` +
      `query=${JSON.stringify(payload.matcher.query ?? {})} ` +
      `persistent=${expectation.persistent} ` +
      `response=${payload.response ? 'custom' : 'auto-green-tile'}`
  )
}

// ### Admin endpoint handlers ################################################

/**
 * Handles all internal admin endpoints used by the test client.
 * It supports CRUD-style operations for expectations, request history, and fallback behavior.
 *
 * @param req - Incoming admin request carrying method, URL, and optional JSON body.
 * @param res - Outgoing response used to return admin operation results.
 * @param pathname - Parsed request pathname used for endpoint routing.
 */
async function handleAdmin(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  pathname: string
): Promise<void> {
  // POST /__mock/expect - add a new expectation
  if (pathname === '/__mock/expect' && req.method === 'POST') {
    const raw = await readBody(req)
    const payload = reviveRegExp(JSON.parse(raw)) as CreateExpectationPayload
    const expectation: MockExpectation = {
      id: randomUUID(),
      matcher: payload.matcher,
      response: payload.response,
      persistent: payload.persistent ?? false,
      hitCount: 0,
      createdAt: Date.now(),
      ttlMs: payload.ttlMs ?? DEFAULT_TTL_MS,
    }
    logExpectation(expectation, payload)
    expectations.push(expectation)
    sendJson(res, { id: expectation.id }, 201)
    return
  }

  // GET /__mock/expectations - list all expectations
  if (pathname === '/__mock/expectations' && req.method === 'GET') {
    sendJson(res, expectations)
    return
  }

  // GET /__mock/requests - list all received requests
  if (pathname === '/__mock/requests' && req.method === 'GET') {
    sendJson(res, receivedRequests)
    return
  }

  // GET /__mock/requests/count - just the count
  if (pathname === '/__mock/requests/count' && req.method === 'GET') {
    sendJson(res, { count: receivedRequests.length })
    return
  }

  // DELETE /__mock/expectations - clear all expectations
  if (pathname === '/__mock/expectations' && req.method === 'DELETE') {
    expectations = []
    sendJson(res, { cleared: true })
    return
  }

  // DELETE /__mock/requests - clear received requests
  if (pathname === '/__mock/requests' && req.method === 'DELETE') {
    receivedRequests = []
    sendJson(res, { cleared: true })
    return
  }

  // DELETE /__mock/reset - clear everything
  if (pathname === '/__mock/reset' && req.method === 'DELETE') {
    expectations = []
    receivedRequests = []
    sendJson(res, { reset: true })
    return
  }

  // PUT /__mock/fallback - set the fallback response
  if (pathname === '/__mock/fallback' && req.method === 'PUT') {
    const raw = await readBody(req)
    fallbackResponse = reviveRegExp(JSON.parse(raw)) as MockResponse
    sendJson(res, { updated: true })
    return
  }

  sendJson(res, { error: 'Unknown admin endpoint' }, 404)
}

// ### Main request handler ###################################################

/**
 * Handles every incoming HTTP request for both admin routes and mocked map traffic.
 * It records requests, applies expectation matching, and sends either matched or fallback responses.
 *
 * @param req - Incoming HTTP request from the application under test or the mock admin client.
 * @param res - Outgoing HTTP response where the mock server writes its result.
 */
async function handleRequest(
  req: http.IncomingMessage,
  res: http.ServerResponse
): Promise<void> {
  const method = req.method ?? 'GET'
  const rawUrl = req.url ?? '/'

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '86400',
    })
    res.end()
    return
  }

  const parsed = new URL(rawUrl, `http://localhost`)
  const pathname = parsed.pathname

  // Route admin endpoints
  if (pathname.startsWith('/__mock/')) {
    await handleAdmin(req, res, pathname)
    return
  }

  // Prune stale entries before processing app requests
  pruneStaleEntries()

  // ## Map service request ##
  const query = parseQuery(rawUrl, 'http://localhost')
  const headers: Record<string, string> = {}
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') headers[key] = value
  }

  const body = ['POST', 'PUT', 'PATCH'].includes(method)
    ? await readBody(req)
    : undefined

  const match = findMatchingExpectation(method, rawUrl, query, headers)

  const received: ReceivedRequest = {
    timestamp: new Date().toISOString(),
    receivedAt: Date.now(),
    method,
    url: rawUrl,
    query,
    headers,
    body,
    matched: !!match,
    matchedExpectationId: match?.id,
  }
  receivedRequests.push(received)

  logToFile(
    method.toLowerCase(),
    `url=${rawUrl} ` +
      `query=${JSON.stringify(query)} ` +
      `matched=${received.matched}` +
      (match ? ` expectation=${match.id}` : '')
  )

  if (match) {
    match.hitCount++
    // remove non-persistent expectations after first hit
    if (!match.persistent) {
      expectations = expectations.filter((e) => e.id !== match.id)
    }

    // use the explicit response if provided, otherwise auto-generate a green tile
    const effectiveResponse: MockResponse = match.response ?? {
      status: 200,
      body: GREEN_TILE,
      headers: { 'Content-Type': 'image/png' },
    }

    if (effectiveResponse.delay) {
      await new Promise((resolve) =>
        setTimeout(resolve, effectiveResponse.delay)
      )
    }

    sendMockResponse(res, effectiveResponse)
  } else {
    sendMockResponse(res, fallbackResponse)
  }
}

// ### Server factory #########################################################

/**
 * Creates a fresh mock map HTTP server instance with reset in-memory state and log file.
 * The returned server can be started by the manager and reused for the full test suite.
 *
 * @returns A configured Node HTTP server ready to listen for requests.
 */
export function createMockMapServer(): http.Server {
  // reset state when a new server is created
  expectations = []
  receivedRequests = []
  fallbackResponse = {
    status: 200,
    body: BLUE_TILE,
    headers: { 'Content-Type': 'image/png' },
  }

  // truncate log file for a fresh run
  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true })
  fs.writeFileSync(LOG_FILE, '')
  logStream = null

  return http.createServer(
    (req: http.IncomingMessage, res: http.ServerResponse) => {
      handleRequest(req, res).catch((err) => {
        // eslint-disable-next-line no-console
        console.error('[MockMapServer] Error handling request:', err)
        res.writeHead(500, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        })
        res.end(JSON.stringify({ error: 'Internal mock server error' }))
      })
    }
  )
}
