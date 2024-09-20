import { test, expect } from '@playwright/test'
import { openSnowbox } from './utils/openSnowbox'

const pinsTargetId = '#vuex-target-pin-coordinate'

test('clicks to the map produce a fetchable pin coordinate', async ({
  page,
}) => {
  await openSnowbox(page)

  const coordinateTarget = page.locator(pinsTargetId)

  await expect(coordinateTarget).toBeEmpty()
  await page.locator('canvas').click()
  await expect(coordinateTarget).toHaveText(/\d+\.\d+,\d+\.\d+/)
})
