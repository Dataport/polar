import { createBdd } from 'playwright-bdd'
import { test } from '../fixtures'

const { Given } = createBdd(test)

declare global {
  interface Window {
    mapInstance: unknown
  }
}

/**
 * Navigates to the client entry page and ensures the client entry page is loaded.
 * This step is a common prerequisite for all tests, as it ensures that the application is in a known state before any interactions occur.
 */
Given('the index page is loaded', async function ({ page, mockMap }) {
  const clientUuid = mockMap.getUuid()

  await page.route('**/wms*', async (route) => {
    const requestUrl = new URL(route.request().url())
    if (!requestUrl.searchParams.has('testClientUuid')) {
      requestUrl.searchParams.set('testClientUuid', clientUuid)
    }
    await route.continue({ url: requestUrl.toString() })
  })

  await page.goto(
    `./dist/index.html?clientUuid=${encodeURIComponent(clientUuid)}`,
    { waitUntil: 'load' }
  )
})

/**
 * Uses the `window.mapInstance` reference to determine when the map is ready.
 */
Given('the map is loaded', async function ({ page }) {
  await page.waitForFunction(() => Boolean(window.mapInstance))
})
