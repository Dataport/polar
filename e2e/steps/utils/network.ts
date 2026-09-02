import type { Page } from '@playwright/test'

/**
 * Waits until the browser reports no network activity. A
 * All network requests have finished loading.
 */
export async function waitForNetworkIdle(page: Page, timeout = 10000) {
  await page.waitForLoadState('networkidle', { timeout })
}
