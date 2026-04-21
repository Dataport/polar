import { createBdd } from 'playwright-bdd'
import { expect, test } from '../../e2e/fixtures'

const { When, Then } = createBdd(test)

/**
 * Clears all expectations and recorded requests for this test client mid-test.
 * Useful when a scenario needs to reset mock state after earlier interactions.
 */
When('the mock map server state is reset', async function ({ mockMap }) {
  await mockMap.clearClientState()
})

/**
 * Registers a persistent catch-all expectation for mock WMS GetMap requests.
 * Matched requests will receive a green tile; the expectation is logged.
 */
When(
  'a WMS GetMap expectation is registered for the mock layer',
  async function ({ mockMap }) {
    const clientUuid = mockMap.getUuid()
    await mockMap.expect(
      {
        url: '/wms',
        query: {
          REQUEST: 'GetMap',
          SERVICE: 'WMS',
          LAYERS: 'mock',
          testClientUuid: clientUuid,
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
  async function ({ mockMap }) {
    const clientUuid = mockMap.getUuid()
    await mockMap.expect(
      {
        url: '/wms',
        query: {
          REQUEST: 'GetMap',
          SERVICE: 'WMS',
          LAYERS: 'mock',
          testClientUuid: clientUuid,
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
  const radioLabel = page.locator('.layer-chooser-selection .v-radio', {
    hasText: 'Mock Map (E2E)',
  })
  await expect(radioLabel).toBeVisible({ timeout: 30000 })
  await expect(async () => {
    await radioLabel.click({ timeout: 5000 })
  }).toPass({ timeout: 30000, intervals: [100, 250, 500, 1000] })
})

/**
 * Asserts that at least one WMS GetMap request was sent to the mock map service.
 * Polls for up to 5 seconds to allow tiles to load after basemap switch.
 */
Then(
  'WMS GetMap requests should have been sent to the mock map service',
  async function ({ mockMap }) {
    const clientUuid = mockMap.getUuid()
    const match = await mockMap.waitForRequest(
      (req) =>
        req.query.REQUEST === 'GetMap' &&
        req.query.SERVICE === 'WMS' &&
        req.query.LAYERS === 'mock' &&
        req.query.testClientUuid === clientUuid,
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
  async function ({ mockMap }) {
    const clientUuid = mockMap.getUuid()
    const unmatchedReq = await mockMap.waitForRequest(
      (req) =>
        req.query.REQUEST === 'GetMap' &&
        req.query.SERVICE === 'WMS' &&
        req.query.LAYERS === 'mock' &&
        req.query.testClientUuid === clientUuid &&
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
