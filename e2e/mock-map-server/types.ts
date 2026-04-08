/**
 * Types for the Mock Map Server.
 *
 * The mock server intercepts GET requests from the web application under test,
 * matches them against pre-planned expectations, and returns configured responses.
 */

/**
 * Default time-to-live in milliseconds for received requests and
 * non-persistent expectations. Entries older than this are pruned
 * automatically so parallel test clients don't interfere with each other.
 */
export const DEFAULT_TTL_MS = 30_000

/** HTTP methods supported by the mock server. */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/**
 * Describes a condition to match an incoming request against.
 * All provided fields must match for the expectation to trigger.
 */
export interface RequestMatcher {
  /** URL path or regex pattern to match (e.g. "/wms" or /\/wms\?.*SERVICE=WMS/). */
  url: string | RegExp
  /** HTTP method to match. Defaults to GET if omitted. */
  method?: HttpMethod
  /**
   * Query parameters that must be present in the request.
   * Values can be strings (exact match) or RegExp (pattern match).
   */
  query?: Record<string, string | RegExp>
  /** Headers that must be present (case-insensitive keys). */
  headers?: Record<string, string | RegExp>
}

/** The response the mock server should send when a request matches. */
export interface MockResponse {
  /** HTTP status code. Defaults to 200. */
  status?: number
  /** Response headers. */
  headers?: Record<string, string>
  /** Response body — string, JSON-serialisable object, or a Buffer. */
  body?: string | Record<string, unknown> | Buffer
  /** Optional artificial delay in ms before responding. */
  delay?: number
}

/**
 * A planned expectation: when a request matching `matcher` arrives,
 * the server responds with `response`.
 */
export interface MockExpectation {
  /** Unique ID assigned by the server. */
  id: string
  /** The condition that must match. */
  matcher: RequestMatcher
  /**
   * The response to return.
   * `undefined` means the server will auto-generate a **green** PNG tile.
   */
  response?: MockResponse
  /**
   * If true the expectation stays active after being matched once.
   * If false (default) it is consumed on the first match.
   */
  persistent?: boolean
  /** How many times this expectation has been matched so far. */
  hitCount: number
  /** Unix timestamp (ms) when this expectation was created. */
  createdAt: number
  /** Time-to-live in ms. After this duration the expectation is pruned. */
  ttlMs: number
}

/** A record of a request that the mock server actually received. */
export interface ReceivedRequest {
  /** Timestamp (ISO string) when the request arrived. */
  timestamp: string
  /** Unix timestamp (ms) — used for TTL-based pruning. */
  receivedAt: number
  /** HTTP method. */
  method: string
  /** Full URL path including query string. */
  url: string
  /** Parsed query parameters. */
  query: Record<string, string>
  /** Request headers. */
  headers: Record<string, string>
  /** Request body (if any). */
  body?: string
  /** Whether this request was matched by an expectation. */
  matched: boolean
  /** The expectation ID that matched, if any. */
  matchedExpectationId?: string
}

/**
 * Options for `waitForRequest` on the client side.
 */
export interface WaitForRequestOptions {
  /** Maximum time to wait in ms. Defaults to 5000. */
  timeout?: number
  /** Polling interval in ms. Defaults to 100. */
  interval?: number
}

/** Shape of the data sent to the admin endpoint to create an expectation. */
export interface CreateExpectationPayload {
  matcher: RequestMatcher
  /**
   * The response to return when matched.
   * If omitted the server auto-generates a **green** 256×256 PNG tile.
   */
  response?: MockResponse
  persistent?: boolean
  /** Custom TTL in ms. Uses DEFAULT_TTL_MS if omitted. */
  ttlMs?: number
}
