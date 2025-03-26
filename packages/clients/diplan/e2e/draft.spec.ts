import { test } from '@playwright/test'
import { openDiPlan } from './utils/openDiplan'

test('this test has yet to be written', async ({ page }) => {
  await openDiPlan(page)

  await page.locator('canvas')
})
