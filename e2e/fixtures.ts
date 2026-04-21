/**
 * Playwright fixture that provides a `mockMap` client to every test.
 *
 * Each test receives its own `MockMapClient` instance with a unique UUID,
 * so expectations and recorded requests are isolated between parallel tests.
 *
 * Usage in spec files:
 *   import { test, expect } from '../e2e/fixtures'
 *   test('zoom sends correct request', async ({ page, mockMap }) => { ... })
 *
 * Usage in BDD step definitions:
 *   import { test } from '../e2e/fixtures'
 *   const { Given, When, Then } = createBdd(test)
 */
import { test as base } from 'playwright-bdd'
import { MockMapClient } from './mock-map-server'

const MOCK_MAP_BASE_URL = process.env.MOCK_MAP_URL ?? 'http://127.0.0.1:3579'

/** Extended test type with `mockMap` fixture. */
export const test = base.extend<{ mockMap: MockMapClient }>({
  // eslint-disable-next-line no-empty-pattern
  mockMap: async ({}, use) => {
    const client = new MockMapClient(MOCK_MAP_BASE_URL)
    await use(client)
    await client.clearClientState()
  },
})

export { expect } from '@playwright/test'
