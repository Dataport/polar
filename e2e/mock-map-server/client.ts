/**
 * Test-facing client for configuring and inspecting the mock map server.
 * It wraps the internal admin endpoints so Playwright and BDD steps can use a clean API.
 */

import type {
  CreateExpectationPayload,
  MockResponse,
  ReceivedRequest,
  RequestMatcher,
  WaitForRequestOptions,
} from './types'

/**
 * Serializes matcher objects so regular expressions survive JSON transport.
 * `RegExp` values are converted to marker objects that the server revives later.
 *
 * @param matcher - Matcher definition containing URL, query, and header expectations.
 * @returns A JSON-safe matcher object preserving regex intent.
 */
function serialiseMatcher(matcher: RequestMatcher): unknown {
  return JSON.parse(
    JSON.stringify(matcher, (_key, value) => {
      if (value instanceof RegExp) {
        return { __regexp: value.source, __flags: value.flags }
      }
      return value
    })
  )
}

export class MockMapClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
  }

  // ## Expectations ########################################################

  /**
   * Registers one request expectation and optional response on the mock server.
   * If no response is provided, the server returns the default green tile response.
   *
   * @param matcher - Request matcher structure used by the server to detect the expected call.
   * @param response - Optional mock response to return when the matcher is satisfied.
   * @param options - Optional expectation settings for persistence and TTL behavior.
   * @returns The created expectation ID returned by the server.
   */
  async expect(
    matcher: RequestMatcher,
    response?: MockResponse,
    options?: { persistent?: boolean; ttlMs?: number }
  ): Promise<string> {
    const payload: CreateExpectationPayload = {
      matcher: serialiseMatcher(matcher) as RequestMatcher,
      response,
      persistent: options?.persistent,
      ttlMs: options?.ttlMs,
    }

    const res = await fetch(`${this.baseUrl}/__mock/expect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(
        `[MockMapClient] Failed to create expectation: ${res.status} ${text}`
      )
    }

    const data = (await res.json()) as { id: string }
    return data.id
  }

  /**
   * Registers multiple expectations in parallel as a convenience helper.
   * Each item uses the same behavior as calling `expect` individually.
   *
   * @param items - List of matcher/response definitions to register in one call.
   * @returns A list of expectation IDs in the same order as the input items.
   */
  expectAll(
    items: Array<{
      matcher: RequestMatcher
      response?: MockResponse
      persistent?: boolean
      ttlMs?: number
    }>
  ): Promise<string[]> {
    return Promise.all(
      items.map((item) =>
        this.expect(item.matcher, item.response, {
          persistent: item.persistent,
          ttlMs: item.ttlMs,
        })
      )
    )
  }

  /**
   * Fetches all currently active expectations from the mock server.
   * This is useful for debugging expectation setup in failing tests.
   *
   * @returns The server-reported expectation list.
   */
  async getExpectations(): Promise<unknown[]> {
    const res = await fetch(`${this.baseUrl}/__mock/expectations`)
    return (await res.json()) as unknown[]
  }

  /**
   * Removes all active expectations from the mock server.
   * Use this when you need a clean matcher state mid-test.
   */
  async clearExpectations(): Promise<void> {
    await fetch(`${this.baseUrl}/__mock/expectations`, { method: 'DELETE' })
  }

  // ## Received Requests #################################################

  /**
   * Fetches every request currently recorded by the mock server.
   * The returned list is used for assertions and debugging.
   *
   * @returns Chronological list of recorded requests.
   */
  async getReceivedRequests(): Promise<ReceivedRequest[]> {
    const res = await fetch(`${this.baseUrl}/__mock/requests`)
    return (await res.json()) as ReceivedRequest[]
  }

  /**
   * Retrieves only the number of recorded requests from the server.
   * This avoids downloading the full request list when only a count is needed.
   *
   * @returns Total number of received requests currently tracked by the server.
   */
  async getReceivedRequestCount(): Promise<number> {
    const res = await fetch(`${this.baseUrl}/__mock/requests/count`)
    const data = (await res.json()) as { count: number }
    return data.count
  }

  /**
   * Clears all stored received-request entries on the mock server.
   * This keeps subsequent assertions focused on new traffic only.
   */
  async clearReceivedRequests(): Promise<void> {
    await fetch(`${this.baseUrl}/__mock/requests`, { method: 'DELETE' })
  }

  // ## Full Reset #######################################################

  /**
   * Performs a full server reset by clearing expectations and request history.
   * This is the fastest way to return the mock server to a fresh state.
   */
  async reset(): Promise<void> {
    await fetch(`${this.baseUrl}/__mock/reset`, { method: 'DELETE' })
  }

  // ## Fallback Response ################################################

  /**
   * Updates the fallback response used when no expectation matches an incoming request.
   * This helps simulate custom default behavior for negative-path tests.
   *
   * @param response - Mock response object used for unmatched requests.
   */
  async setFallback(response: MockResponse): Promise<void> {
    await fetch(`${this.baseUrl}/__mock/fallback`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response),
    })
  }

  // ## Waiting / Polling ################################################

  /**
   * Polls the server until a recorded request satisfies the provided predicate or timeout is reached.
   * This is useful when request arrival is asynchronous relative to UI actions.
   *
   * @param predicate - Function that matches a recorded request.
   * @param options - Optional wait settings for timeout and polling interval.
   * @returns The first matching request, or `null` when timeout expires.
   */
  async waitForRequest(
    predicate: (req: ReceivedRequest) => boolean,
    options?: WaitForRequestOptions
  ): Promise<ReceivedRequest | null> {
    const timeout = options?.timeout ?? 5000
    const interval = options?.interval ?? 100
    const deadline = Date.now() + timeout

    while (Date.now() < deadline) {
      const requests = await this.getReceivedRequests()
      const match = requests.find(predicate)
      if (match) return match
      await new Promise((resolve) => setTimeout(resolve, interval))
    }

    return null
  }

  /**
   * Waits for a matching request and throws an error if none appears in time.
   * Use this for strict assertions where missing traffic should fail the test immediately.
   *
   * @param predicate - Function that identifies the expected request.
   * @param options - Optional wait configuration and custom failure message.
   * @returns The matching recorded request.
   * @throws Error when no matching request is found.
   */
  async waitForRequestOrFail(
    predicate: (req: ReceivedRequest) => boolean,
    options?: WaitForRequestOptions & { message?: string }
  ): Promise<ReceivedRequest> {
    const result = await this.waitForRequest(predicate, options)
    if (!result) {
      const timeoutMs = options?.timeout ?? 5000
      const msg =
        options?.message ??
        `[MockMapClient] Timed out waiting for a matching request (${timeoutMs}ms)`
      throw new Error(msg)
    }
    return result
  }

  /**
   * Asserts that no recorded request matches the predicate during the given time window.
   * This is intended for negative tests where specific network calls must not happen.
   *
   * @param predicate - Function that identifies a forbidden request.
   * @param duration - Wait window in milliseconds to observe for unexpected traffic.
   * @throws Error when any matching request is recorded.
   */
  async assertNoRequest(
    predicate: (req: ReceivedRequest) => boolean,
    duration = 1000
  ): Promise<void> {
    const result = await this.waitForRequest(predicate, {
      timeout: duration,
      interval: 100,
    })
    if (result) {
      throw new Error(
        `[MockMapClient] Unexpected request received: ${result.method} ${result.url}`
      )
    }
  }
}
