import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { getModalLocator, setModalLocator } from '../../context'

const { When, Then } = createBdd()

When('the modal is opened', ({ page }) => {
  setModalLocator(page, page.locator('.modal-card'))
})

Then('the button should be disabled', async ({ page }) => {
  await expect(getModalLocator(page).getByRole('button')).toBeDisabled()
})

When('the checkbox is clicked', async ({ page }) => {
  await page.locator('.v-input--checkbox').click()
})

Then('the button should be enabled', async ({ page }) => {
  await expect(getModalLocator(page).getByRole('button')).toBeEnabled()
})

When('the button is clicked', async ({ page }) => {
  await getModalLocator(page).getByRole('button').click()
})

Then('the modal should be closed', async ({ page }) => {
  await expect(page.locator('.modal-card')).toHaveCount(0)
})
