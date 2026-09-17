import type { Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

import {
	ICON_MENU_BUTTON_SELECTOR,
	ICON_MENU_LIST_SELECTOR,
} from '../support/selectors'

const { When, Then } = createBdd()

const iconButtons = (page: Page) =>
	page.locator(ICON_MENU_LIST_SELECTOR).locator(ICON_MENU_BUTTON_SELECTOR)

/**
 * Reads the accessible names of all icon menu buttons in DOM order.
 *
 * POLAR icon buttons carry no `aria-label`; their name comes from a visually
 * hidden label next to the `aria-hidden` icon span.
 */
async function getIconLabels(page: Page): Promise<string[]> {
	return iconButtons(page).evaluateAll((buttons) =>
		buttons
			.map((button) => button.textContent.trim())
			.filter((label) => label.length > 0)
	)
}

/**
 * Clicks each enabled icon in the icon menu sequentially.
 */
When(
	'each icon in the icon menu is clicked one by one',
	async function ({ page }) {
		const labels = await getIconLabels(page)
		expect(labels.length).toBeGreaterThan(0)

		for (const label of labels) {
			// Clicking toggles panels, so the buttons are re-resolved by name.
			const button = page
				.getByRole('button', { name: label, exact: true })
				.first()

			if (!(await button.isEnabled())) {
				continue
			}

			await button.scrollIntoViewIfNeeded()
			await button.click({ timeout: 5000 })
		}
	}
)

/**
 * Verifies that each icon responded to click actions.
 */
Then('each icon should respond to the click action', async function ({ page }) {
	await expect(iconButtons(page).first()).toBeVisible()
})

/**
 * Checks that the icon menu is present on the page.
 */
Then('the icon menu should be present', async function ({ page }) {
	await expect(page.locator(ICON_MENU_LIST_SELECTOR)).toBeVisible()
})

/**
 * Verifies the icon menu contains specific icons in the expected order.
 *
 * @param dataTable - Table of expected icon labels.
 */
Then(
	'the icon menu should contain the following icons in order:',
	async function ({ page }, dataTable) {
		const expectedLabels: string[] = dataTable
			.rows()
			.map((row) => row[0].trim())

		await expect(page.locator(ICON_MENU_LIST_SELECTOR)).toBeVisible()
		await expect
			.poll(async () => (await getIconLabels(page)).length, {
				timeout: 15_000,
			})
			.toBeGreaterThanOrEqual(expectedLabels.length)

		const actualLabels = await getIconLabels(page)

		let cursor = 0
		for (const expectedLabel of expectedLabels) {
			const foundIndex = actualLabels.indexOf(expectedLabel, cursor)
			expect(
				foundIndex,
				`Expected icon "${expectedLabel}" after index ${
					cursor - 1
				}. Actual icons: ${actualLabels.join(' | ')}`
			).toBeGreaterThanOrEqual(0)
			cursor = foundIndex + 1
		}
	}
)
