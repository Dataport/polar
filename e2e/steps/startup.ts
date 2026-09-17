import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

import { test } from '../fixtures'
import { getClientEntryPath, MOCK_MAP_BASE_URL } from '../support/config'
import { MAP_CANVAS_SELECTOR } from '../support/selectors'

const { Given } = createBdd(test)

const MOCK_MAP_TAG = '@mock-map-service'

/**
 * Navigates to the client entry page and ensures the client entry page is loaded.
 * This step is a common prerequisite for all tests, as it ensures that the application is in a known state before any interactions occur.
 */
Given('the index page is loaded', async function ({ page, $tags, mockMap }) {
	const parameters = new URLSearchParams({ clientUuid: mockMap.getUuid() })

	// Only scenarios exercising the mock server get its extra background layer.
	if ($tags.includes(MOCK_MAP_TAG)) {
		parameters.set('mockMapUrl', `${MOCK_MAP_BASE_URL}/wms`)
	}

	await page.goto(`${getClientEntryPath($tags)}?${parameters.toString()}`, {
		waitUntil: 'load',
	})
})

/**
 * Waits until the `polar-map` custom element has rendered its OpenLayers canvas.
 */
Given('the map is loaded', async function ({ page }) {
	await expect(page.locator(MAP_CANVAS_SELECTOR).first()).toBeVisible({
		timeout: 45_000,
	})
})
