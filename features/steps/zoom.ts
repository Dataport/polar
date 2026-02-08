import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { Given, When, Then } = createBdd()

const ZOOM_IN_LABEL = 'Zoom in'
const ZOOM_OUT_LABEL = 'Zoom out'
const SNOWBOX_ZOOM_TARGET_ID = '#vuex-target-zoom'

async function clickUntilDisabled(
  button: ReturnType<import('@playwright/test').Page['getByLabel']>,
  maxClicksSafetyCap = 50
): Promise<void> {
  let clicks = 0
  while (clicks < maxClicksSafetyCap && (await button.isEnabled())) {
    await button.click()
    clicks += 1
  }
  await expect(button).toBeDisabled()
}

/**
 * Ensures the map is zoomed in to its maximum zoom level.
 */
Given('the map is zoomed in at maximum zoom level', async function ({ page }) {
  await clickUntilDisabled(page.getByLabel(ZOOM_IN_LABEL))
})

/**
 * Ensures the map is zoomed out to its minimum zoom level.
 */
Given('the map is zoomed out at minimum zoom level', async function ({ page }) {
  await clickUntilDisabled(page.getByLabel(ZOOM_OUT_LABEL))
})

/**
 * Clicks the zoom out button a specific number of times.
 *
 * @param {number} times - Number of clicks to perform.
 */
When(
  'the zoom out button is clicked {int} time(s)',
  async function ({ page }, times: number) {
    const zoomOutButton = page.getByLabel(ZOOM_OUT_LABEL)

    for (let i = 0; i < times; i++) {
      await zoomOutButton.click()
    }
  }
)

/**
 * Clicks the zoom in button a specific number of times.
 *
 * @param {number} times - Number of clicks to perform.
 */
When(
  'the zoom in button is clicked {int} time(s)',
  async function ({ page }, times: number) {
    const zoomInButton = page.getByLabel(ZOOM_IN_LABEL)

    for (let i = 0; i < times; i++) {
      await zoomInButton.click()
    }
  }
)

/**
 * Checks that the zoom-in button is disabled.
 */
Then('the zoom in button should be disabled', async function ({ page }) {
  await expect(page.getByLabel(ZOOM_IN_LABEL)).toBeDisabled()
})

/**
 * Checks that the zoom-out button is disabled.
 */
Then('the zoom out button should be disabled', async function ({ page }) {
  await expect(page.getByLabel(ZOOM_OUT_LABEL)).toBeDisabled()
})

/**
 * Checks that the zoom-out button is enabled.
 */
Then('the zoom out button should be enabled', async function ({ page }) {
  await expect(page.getByLabel(ZOOM_OUT_LABEL)).toBeEnabled()
})

/**
 * Checks that the zoom-in button is enabled.
 */
Then('the zoom in button should be enabled', async function ({ page }) {
  await expect(page.getByLabel(ZOOM_IN_LABEL)).toBeEnabled()
})

/**
 * Verifies that the current zoom level matches the expected level.
 * [WARNING] This step currently only works with the Snowbox client.
 *
 * @param {number} expectedLevel - The expected zoom level.
 */
Then(
  'the zoom level should be at level {int}',
  async function ({ page }, expectedLevel: number) {
    const vuexZoomLevel = page.locator(SNOWBOX_ZOOM_TARGET_ID)
    if ((await vuexZoomLevel.count()) > 0) {
      await expect(vuexZoomLevel).toHaveText(String(expectedLevel))
    }
  }
)
