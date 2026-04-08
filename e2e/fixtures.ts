/**
 * Playwright fixture that provides a `mockMap` client to every test.
 *
 * Usage in spec files:
 *   import { test, expect } from '../e2e/fixtures'
 *   test('zoom sends correct request', async ({ page, mockMap }) => { ... })
 *
 * Usage in BDD step definitions:
 *   import { test } from '../e2e/fixtures'
 *   const { Given, When, Then } = createBdd(test)
 *
 * The fixture resets the mock server before each test so each case starts
 * with empty expectations and request history. This should change if parallel mock map usage is added.
 */
import { test as base } from '@playwright/test'
import { MockMapClient } from './mock-map-server'

const MOCK_MAP_BASE_URL = process.env.MOCK_MAP_URL ?? 'http://127.0.0.1:3579'

/** Extended test type with `mockMap` fixture. */
export const test = base.extend<{ mockMap: MockMapClient }>({
  mockMap: async (_unused, use) => {
    const client = new MockMapClient(MOCK_MAP_BASE_URL)
    await client.reset()
    await use(client)
  },
})

export { expect } from '@playwright/test'
