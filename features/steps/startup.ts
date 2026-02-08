import { createBdd } from 'playwright-bdd'

const { Given } = createBdd()

declare global {
  interface Window {
    mapInstance: unknown
  }
}

/**
 * Navigates to the client entry page and ensures the client entry page is loaded.
 * This step is a common prerequisite for all tests, as it ensures that the application is in a known state before any interactions occur.
 */
Given('the index page is loaded', async function ({ page }) {
  await page.goto('./dist/index.html', { waitUntil: 'load' })
})

/**
 * Uses the `window.mapInstance` reference to determine when the map is ready.
 */
Given('the map is loaded', async function ({ page }) {
  await page.waitForFunction(() => Boolean(window.mapInstance))
})
