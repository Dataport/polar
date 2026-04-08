import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { MockMapClient } from '../../e2e/mock-map-server'

const { Given, When, Then } = createBdd()

const MOCK_MAP_BASE_URL = 'http://127.0.0.1:3579'

/**
 * Resets all mock server state (expectations + received requests) so that
 * parallel scenarios don't interfere with each other.
 */
Given('the mock map server state is reset', async function () {
  const client = new MockMapClient(MOCK_MAP_BASE_URL)
  await client.reset()
})

/**
 * Registers a persistent catch-all expectation for mock WMS GetMap requests.
 * Matched requests will receive a green tile; the expectation is logged.
 */
When(
  'a WMS GetMap expectation is registered for the mock layer',
  async function () {
    const client = new MockMapClient(MOCK_MAP_BASE_URL)
    await client.expect(
      {
        url: '/wms',
        query: {
          REQUEST: 'GetMap',
          SERVICE: 'WMS',
          LAYERS: 'mock',
        },
      },
      undefined,
      { persistent: true }
    )
  }
)

/**
 * Registers a single-use (non-persistent) expectation for mock WMS GetMap requests.
 * Only the first matching request receives a green tile; the expectation is
 * consumed afterwards, so subsequent requests fall through to the blue fallback.
 */
When(
  'a single-use WMS GetMap expectation is registered for the mock layer',
  async function () {
    const client = new MockMapClient(MOCK_MAP_BASE_URL)
    await client.expect(
      {
        url: '/wms',
        query: {
          REQUEST: 'GetMap',
          SERVICE: 'WMS',
          LAYERS: 'mock',
        },
      },
      undefined,
      { persistent: false }
    )
  }
)

/**
 * Opens the layer chooser panel via the icon menu.
 */
When('the layer chooser is opened', async function ({ page }) {
  const button = page.locator(
    '.icon-menu-list-item button[aria-label="Choose map"]'
  )
  await button.click()
  await expect(page.locator('.layer-chooser-selection')).toBeVisible()
})

/**
 * Selects the mock map basemap in the layer chooser panel.
 * Playwright's built-in auto-waiting handles DOM re-renders; we just
 * need to give enough time for the layer chooser to finish rendering.
 */
When('the mock map basemap is selected', async function ({ page }) {
  const radio = page.locator('.layer-chooser-selection .v-radio', {
    hasText: 'Mock Map (E2E)',
  })
  // Wait for the radio to be attached & visible before clicking
  await expect(radio).toBeVisible({ timeout: 15000 })
  await radio.click()
})

/**
 * Asserts that at least one WMS GetMap request was sent to the mock map service.
 * Polls for up to 5 seconds to allow tiles to load after basemap switch.
 */
Then(
  'WMS GetMap requests should have been sent to the mock map service',
  async function () {
    const client = new MockMapClient(MOCK_MAP_BASE_URL)
    const match = await client.waitForRequest(
      (req) =>
        req.query.REQUEST === 'GetMap' &&
        req.query.SERVICE === 'WMS' &&
        req.query.LAYERS === 'mock',
      { timeout: 5000 }
    )
    expect(
      match,
      'Expected at least one WMS GetMap request to the mock map service, ' +
        'but none arrived within 5 s'
    ).not.toBeNull()
    // wait 5 seconds to see png in trace
    await new Promise((resolve) => setTimeout(resolve, 5000))
  }
)

/**
 * Asserts that at least one WMS GetMap request was received that did NOT match
 * any expectation (i.e. it fell through to the blue fallback tile).
 * Polls for up to 5 seconds.
 */
Then(
  'subsequent WMS GetMap requests should return the blue fallback tile',
  async function () {
    const client = new MockMapClient(MOCK_MAP_BASE_URL)
    const unmatchedReq = await client.waitForRequest(
      (req) =>
        req.query.REQUEST === 'GetMap' &&
        req.query.SERVICE === 'WMS' &&
        req.query.LAYERS === 'mock' &&
        !req.matched,
      { timeout: 5000 }
    )
    expect(
      unmatchedReq,
      'Expected at least one unmatched WMS GetMap request (blue fallback), ' +
        'but none arrived within 5 s'
    ).not.toBeNull()
  }
)
