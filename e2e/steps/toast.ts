import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

import {
	TOAST_DISMISS_BUTTON_SELECTOR,
	TOAST_SELECTOR,
} from '../support/selectors'

const { When, Then } = createBdd()

/** info: playwright trace option will not capture the toast. (known bug from 2024 https://github.com/microsoft/playwright/issues/32490) */

/** Toasts are added on a timer during snowbox startup, so we wait generously. */
const TOAST_TIMEOUT = 15_000

const toastByMessage = (page: Page, message: string): Locator =>
	page.locator(TOAST_SELECTOR).filter({ hasText: message })

/**
 * This step definition checks if a toast message with the specified text is visible in the UI.
 *
 * @param message - The text of the toast message that should be visible in the UI.
 */
Then(
	'the toast message {string} should be visible in the UI',
	async function ({ page }, message: string) {
		await expect(page.getByText(message)).toBeVisible({
			timeout: TOAST_TIMEOUT,
		})
	}
)

/**
 * Dismisses a toast by clicking its close button.
 * Toasts may vanish on their own (e.g. when the plugin is removed), so an
 * already-gone toast is treated as successfully dismissed.
 *
 * @param message - The text of the toast message to dismiss.
 */
When(
	'the toast message {string} is dismissed',
	async function ({ page }, message: string) {
		const toast = toastByMessage(page, message).first()

		if (!(await toast.isVisible())) {
			return
		}

		await toast.locator(TOAST_DISMISS_BUTTON_SELECTOR).click()
		await expect(toast).toBeHidden()
	}
)

/**
 * Checks that a toast message is no longer rendered.
 *
 * @param message - The text of the toast message that must be gone.
 */
Then(
	'the toast message {string} should no longer be visible in the UI',
	async function ({ page }, message: string) {
		await expect(toastByMessage(page, message)).toHaveCount(0)
	}
)

/**
 * Checks how many toasts are currently rendered.
 *
 * @param count - The expected number of toasts.
 */
Then(
	'{int} toast messages should be visible in the UI',
	async function ({ page }, count: number) {
		await expect(page.locator(TOAST_SELECTOR)).toHaveCount(count)
	}
)
