import { test, expect } from '@playwright/test'

test(
  'test playwright controls',
  { tag: ['@polar/client-dish', '@test'] },
  async ({ page }) => {
    await page.goto('./dist/index.html')

    const modal = await page.locator('.modal-card')

    expect(await modal.getByRole('button')).toBeDisabled()
    await page.locator('.v-input--checkbox').click()
    expect(await modal.getByRole('button')).toBeEnabled()
    await modal.getByRole('button').click()
    // modal gets deleted
    expect(await page.locator('.modal-card')).toHaveCount(0)
  }
)
