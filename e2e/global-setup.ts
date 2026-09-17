/**
 * Playwright global setup — starts the mock map server before the test suite
 * and warms up the vite dev server.
 *
 * Referenced from playwright.config.ts via `globalSetup`.
 */
import { firefox } from '@playwright/test'

import { MockMapServerManager } from './mock-map-server'
import { CLIENT_BASE_URL, getClientEntryPath } from './support/config'
import { MAP_CANVAS_SELECTOR } from './support/selectors'

/**
 * Loads the client once before the workers start.
 *
 * The dev server transforms modules on demand; without this, a dozen workers
 * request the whole module graph at once and the first page loads time out.
 */
async function warmUpClient(): Promise<void> {
	const browser = await firefox.launch()
	try {
		const page = await browser.newPage()
		await page.goto(`${CLIENT_BASE_URL}${getClientEntryPath()}`, {
			waitUntil: 'load',
			timeout: 120_000,
		})
		await page
			.locator(MAP_CANVAS_SELECTOR)
			.first()
			.waitFor({ state: 'visible', timeout: 120_000 })
	} finally {
		await browser.close()
	}
}

async function globalSetup(): Promise<void> {
	const manager = MockMapServerManager.getInstance()
	await manager.start()
	await warmUpClient()
}

export default globalSetup
