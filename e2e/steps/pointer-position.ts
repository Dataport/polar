import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

import {
	MAP_CANVAS_SELECTOR,
	POINTER_POSITION_PROJECTION_LABEL,
	POINTER_POSITION_SELECTOR,
	POINTER_POSITION_VALUE_SELECTOR,
} from '../support/selectors'
import { getPointerPosition, setPointerPosition } from './context'

const { Given, When, Then } = createBdd()

/** Matches the plugin's `x, y` output for any projection and decimal count. */
const COORDINATE_PATTERN = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/

const positionValue = (page: Page): Locator =>
	page.locator(POINTER_POSITION_VALUE_SELECTOR)

const readPosition = async (page: Page): Promise<string> =>
	((await positionValue(page).textContent()) ?? '').trim()

/**
 * Moves the mouse onto the map so OpenLayers emits a `pointermove` event.
 *
 * `hover` is used over raw `mouse.move` coordinates because the map sits below
 * the fold in the default viewport and needs to be scrolled into view first.
 */
Given(
	'the pointer is moved to the center of the map',
	async function ({ page }) {
		await page.locator(MAP_CANVAS_SELECTOR).first().hover()
	}
)

/**
 * Verifies the pointer position widget shows the given literal text.
 *
 * @param expectedText - Text expected to be rendered, e.g. the `X, Y` placeholder.
 */
Given(
	'the pointer position should display {string}',
	async function ({ page }, expectedText: string) {
		await expect(positionValue(page)).toHaveText(expectedText)
	}
)

/**
 * Verifies the widget switched from the placeholder to an actual coordinate.
 */
Then('the pointer position should display a coordinate', async function ({
	page,
}) {
	await expect.poll(() => readPosition(page)).toMatch(COORDINATE_PATTERN)
})

/**
 * Switches the projection, capturing the coordinate shown beforehand so the
 * follow-up step can prove the value was reprojected.
 *
 * @param projection - EPSG code to select, e.g. `EPSG:4326`.
 */
When(
	'the coordinate reference system {string} is selected',
	async function ({ page }, projection: string) {
		setPointerPosition(page, await readPosition(page))

		await page
			.locator(POINTER_POSITION_SELECTOR)
			.getByLabel(POINTER_POSITION_PROJECTION_LABEL, { exact: true })
			.selectOption(projection)
	}
)

/**
 * Verifies the coordinate changed after the projection switch.
 */
Then('the pointer position should display a different coordinate', async function ({
	page,
}) {
	const previous = getPointerPosition(page)

	await expect.poll(() => readPosition(page)).not.toBe(previous)
	await expect.poll(() => readPosition(page)).toMatch(COORDINATE_PATTERN)
})
