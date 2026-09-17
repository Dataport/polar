import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

import {
	FULLSCREEN_DISABLE_LABEL,
	FULLSCREEN_ENABLE_LABEL,
	MAP_ELEMENT_SELECTOR,
} from '../support/selectors'

const { Given, When, Then } = createBdd()

/**
 * The button's accessible name flips with the fullscreen state, so both names
 * are matched to keep a single locator valid across the whole scenario.
 */
const fullscreenButton = (page: Page): Locator =>
	page
		.getByRole('button', { name: FULLSCREEN_ENABLE_LABEL, exact: true })
		.or(
			page.getByRole('button', { name: FULLSCREEN_DISABLE_LABEL, exact: true })
		)
		.first()

interface FullscreenLayout {
	coversViewport: boolean
	isFullscreenElement: boolean
}

const FULLSCREEN_LAYOUT: FullscreenLayout = {
	coversViewport: true,
	isFullscreenElement: true,
}

const INLINE_LAYOUT: FullscreenLayout = {
	coversViewport: false,
	isFullscreenElement: false,
}

/**
 * Reads the actual rendering situation instead of the plugin's internal state:
 * the map element has to be the browser's fullscreen element *and* has to cover
 * the whole viewport. Outside fullscreen mode, the example sizes the map to
 * 90vw × 600px, so the viewport check is meaningful in both directions.
 */
const fullscreenLayout = (page: Page): Promise<FullscreenLayout | null> =>
	page.evaluate((selector) => {
		const element = document.querySelector(selector)

		if (element === null) {
			return null
		}

		const { width, height } = element.getBoundingClientRect()

		return {
			coversViewport:
				Math.abs(width - window.innerWidth) <= 1 &&
				Math.abs(height - window.innerHeight) <= 1,
			isFullscreenElement: document.fullscreenElement === element,
		}
	}, MAP_ELEMENT_SELECTOR)

/**
 * Asserts the scenario starts from a non-fullscreen map.
 */
Given('the map is not in fullscreen mode', async function ({ page }) {
	await expect.poll(() => fullscreenLayout(page)).toEqual(INLINE_LAYOUT)
	await expect(fullscreenButton(page)).toHaveAccessibleName(
		FULLSCREEN_ENABLE_LABEL
	)
})

/**
 * Toggles fullscreen mode via the plugin's icon button.
 */
When('the fullscreen button is clicked', async function ({ page }) {
	await fullscreenButton(page).click()
})

/**
 * Toggles fullscreen mode a second time within the same scenario.
 */
When('the fullscreen button is clicked again', async function ({ page }) {
	await fullscreenButton(page).click()
})

/**
 * Verifies the map is rendered fullscreen and the button offers the exit action.
 */
Then('the map should enter fullscreen mode', async function ({ page }) {
	await expect.poll(() => fullscreenLayout(page)).toEqual(FULLSCREEN_LAYOUT)
	await expect(fullscreenButton(page)).toHaveAccessibleName(
		FULLSCREEN_DISABLE_LABEL
	)
})

/**
 * Verifies the map returned to its inline size and the button offers the enter
 * action.
 */
Then('the map should exit fullscreen mode', async function ({ page }) {
	await expect.poll(() => fullscreenLayout(page)).toEqual(INLINE_LAYOUT)
	await expect(fullscreenButton(page)).toHaveAccessibleName(
		FULLSCREEN_ENABLE_LABEL
	)
})
