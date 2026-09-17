import type { Locator, Page } from '@playwright/test'
import type { DataTable } from 'playwright-bdd'

import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

import {
	SCALE_SWITCHER_LABEL,
	SCALE_WIDGET_SELECTOR,
	ZOOM_STATE_SELECTOR,
} from '../support/selectors'

const { When, Then } = createBdd()

/**
 * The widget renders scales as `1 : 60,000` while features spell them as
 * `1:60,000`; comparing without whitespace keeps both notations valid.
 */
const normalizeScale = (scale: string): string => scale.replace(/\s/g, '')

const scaleSwitcher = (page: Page): Locator =>
	page
		.locator(SCALE_WIDGET_SELECTOR)
		.getByLabel(SCALE_SWITCHER_LABEL, { exact: true })

/**
 * Reads the scale currently shown by the switcher.
 *
 * @param page - Active Playwright page instance.
 * @returns The selected scale in normalized notation, e.g. `1:60,000`.
 */
async function readScale(page: Page): Promise<string> {
	const switcher = scaleSwitcher(page)
	const value = await switcher.inputValue()
	const label = await switcher.locator(`option[value="${value}"]`).textContent()
	return normalizeScale(label ?? '')
}

/**
 * Picks the option carrying the given scale, matching by label rather than by
 * the option's value since the value is the zoom level under test.
 *
 * @param page - Active Playwright page instance.
 * @param scale - Scale to select, e.g. `1:100,000`.
 */
async function selectScale(page: Page, scale: string): Promise<void> {
	const switcher = scaleSwitcher(page)
	const options = await switcher.locator('option').all()

	for (const option of options) {
		const label = normalizeScale((await option.textContent()) ?? '')
		if (label === normalizeScale(scale)) {
			await switcher.selectOption(await option.getAttribute('value'))
			return
		}
	}

	throw new Error(`The scale switcher offers no option for "${scale}".`)
}

/**
 * Selects a scale from the scale switcher.
 *
 * @param scale - Scale to select, e.g. `1:100,000`.
 */
When(
	'the scale {string} is selected',
	async function ({ page }, scale: string) {
		await selectScale(page, scale)
	}
)

/**
 * Verifies the scale switcher shows the expected scale.
 *
 * @param expectedScale - Scale expected to be displayed, e.g. `1:60,000`.
 */
Then(
	'the scale should display {string}',
	async function ({ page }, expectedScale: string) {
		await expect.poll(() => readScale(page)).toBe(normalizeScale(expectedScale))
	}
)

/**
 * Selects every scale of the table and verifies the resulting zoom level.
 * [WARNING] This step relies on the plugin state debug view of the example page.
 *
 * @param dataTable - Table with the columns `Scale` and `Zoom Level`.
 */
Then(
	'all scale to zoom level mappings should be correct',
	async function ({ page }, dataTable: DataTable) {
		for (const { Scale, 'Zoom Level': zoomLevel } of dataTable.hashes()) {
			if (!Scale || !zoomLevel) {
				throw new Error(
					`Invalid data table row: Scale="${Scale}", Zoom Level="${zoomLevel}"`
				)
			}
			await selectScale(page, Scale)
			await expect(page.locator(ZOOM_STATE_SELECTOR)).toHaveText(zoomLevel)
		}
	}
)
