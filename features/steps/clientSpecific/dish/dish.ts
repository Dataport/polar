import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { When, Then } = createBdd()

When('the modal is opened', async function ({ page }) {
  this.modal = await page.locator('.modal-card')
})

Then('the button should be disabled', async function () {
  expect(await this.modal.getByRole('button')).toBeDisabled()
})

When('the checkbox is clicked', async function ({ page }) {
  await page.locator('.v-input--checkbox').click()
})

Then('the button should be enabled', async function () {
  expect(await this.modal.getByRole('button')).toBeEnabled()
})

When('the button is clicked', async function () {
  await this.modal.getByRole('button').click()
})

Then('the modal should be closed', async function ({ page }) {
  expect(await page.locator('.modal-card')).toHaveCount(0)
})
