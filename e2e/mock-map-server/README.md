# Mock Map Server

A lightweight mock HTTP server for testing map service interactions in Cucumber tests.

## Architecture

```
e2e/mock-map-server/
├── types.ts      # TypeScript interfaces (RequestMatcher, MockResponse, etc.)
├── server.ts     # HTTP server (Node built-in `http`) with admin + catch-all endpoints
├── manager.ts    # Singleton lifecycle manager (start / stop)
├── client.ts     # Test-facing API (expect, waitForRequest, reset, …)
└── index.ts      # Barrel export

e2e/
├── global-setup.ts    # Starts the mock server before the test suite
├── global-teardown.ts # Stops the mock server after the test suite
└── fixtures.ts        # Playwright fixture providing `mockMap` to every test
```

## Example In a Cucumber / BDD step definition

```ts
import { createBdd } from 'playwright-bdd'
import { test } from '../../e2e/fixtures'
import { expect } from '@playwright/test'

const { Given, When, Then } = createBdd(test)

Given('the map service expects a WMS GetMap request', async ({ mockMap }) => {
  await mockMap.expect(
    { url: '/wms', query: { REQUEST: 'GetMap' } },
    { status: 200, headers: { 'Content-Type': 'image/png' }, body: '<tile>' },
    { persistent: true }
  )
})

When('the user zooms in', async ({ page }) => {
  await page.getByLabel('zoom in').click()
})

Then('a WMS request should have been sent', async ({ mockMap }) => {
  const req = await mockMap.waitForRequestOrFail(
    r => r.url.includes('/wms') && r.query.REQUEST === 'GetMap',
    { timeout: 5000 }
  )
  expect(req).toBeDefined()
})
```

## API Reference

### `MockMapClient`

| Method | Description |
|--------|-------------|
| `expect(matcher, response, opts?)` | Plan an expected request → response mapping. Returns the expectation ID. |
| `expectAll(items[])` | Plan multiple expectations at once. |
| `getExpectations()` | List all active expectations. |
| `clearExpectations()` | Remove all expectations. |
| `getReceivedRequests()` | Get all requests the mock server received. |
| `getReceivedRequestCount()` | Get just the count. |
| `clearReceivedRequests()` | Clear received requests. |
| `reset()` | Full reset (expectations + received requests). |
| `setFallback(response)` | Set response for unmatched requests (default: server-configured fallback). |
| `waitForRequest(predicate, opts?)` | Poll until a matching request is found, or return `null` on timeout. |
| `waitForRequestOrFail(predicate, opts?)` | Same as above but throws on timeout. |
| `assertNoRequest(predicate, duration?)` | Assert no matching request arrives within `duration` ms. |

### `RequestMatcher`

```ts
{
  url: string | RegExp     // URL path to match
  method?: HttpMethod      // defaults to 'GET'
  query?: Record<string, string | RegExp>
  headers?: Record<string, string | RegExp>
}
```

### `MockResponse`

```ts
{
  status?: number          // defaults to 200
  headers?: Record<string, string>
  body?: string | object | Buffer
  delay?: number           // artificial delay in ms
}
```

### Expectation Options

| Option | Default | Description |
|--------|---------|-------------|
| `persistent` | `false` | If `true`, the expectation stays active after being matched. If `false`, it's consumed on first match. |

## How It Works

1. **Global Setup** (`e2e/global-setup.ts`) starts the server on its configured host and port before any test runs.
2. **Fixture** (`e2e/fixtures.ts`) injects a `mockMap` client and calls `reset()` before each test.
3. **During the test**, your code plans expectations and the web application's network calls hit the mock server instead of the real map service.
4. **Global Teardown** (`e2e/global-teardown.ts`) shuts down the server when the suite is complete.

## Admin Endpoints (internal)

These are used by `MockMapClient` under the hood:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/__mock/expect` | POST | Add a new expectation |
| `/__mock/expectations` | GET | List expectations |
| `/__mock/expectations` | DELETE | Clear expectations |
| `/__mock/requests` | GET | List received requests |
| `/__mock/requests/count` | GET | Request count |
| `/__mock/requests` | DELETE | Clear received requests |
| `/__mock/reset` | DELETE | Full reset |
| `/__mock/fallback` | PUT | Set fallback response |

## Configuration

| Env Variable | Default | Description |
|-------------|---------|-------------|
| `MOCK_MAP_URL` | Defined in `e2e/fixtures.ts` via `MOCK_MAP_BASE_URL` | Base URL for the mock server |

The port can also be changed via `MockMapServerManager.getInstance(customPort)`.
