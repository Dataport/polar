import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { dispatch } from '../../e2e/utils/vuex'

const { When, Then } = createBdd()

/** info: playwright trace option will not capture the toast. (known bug from 2024 https://github.com/microsoft/playwright/issues/32490) */

/**
 * This step definition simulates the programmatic dispatch of a toast message in the application. It uses the `dispatch` function to trigger the addition of a toast message with a specified type and text.
 *
 * @param {string} toastType - The type of the toast message (e.g., 'success', 'error', 'info').
 * @param {string} message - The text content of the toast message.
 */
When(
  'a toast {string} is programmatically dispatched with message {string}',
  async function ({ page }, toastType: string, message: string) {
    await dispatch(page, 'plugin/toast/addToast', {
      type: toastType,
      text: message,
    })
  }
)

/**
 * This step definition checks if a toast message with the specified text is visible in the UI.
 *
 * @param {string} message - The text of the toast message that should be visible in the UI.
 */
Then(
  'the toast message {string} should be visible in the UI',
  async function ({ page }, message: string) {
    await expect(page.getByText(message)).toBeVisible()
  }
)
