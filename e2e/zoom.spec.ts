import { test, expect } from '@playwright/test'
import { openSnowbox } from './utils/openSnowbox'
import { clickTimes } from './utils/clickTimes'

const zoomTargetId = '#vuex-target-zoom'

test('zoom in button zooms in until max zoom', async ({ page }) => {
  const zoomInLabel = 'Zoom in'
  await openSnowbox(page)

  const zoomTarget = page.locator(zoomTargetId)
  await expect(zoomTarget).toHaveText('2')
  await clickTimes({ page, value: zoomInLabel, times: 7 })
  await expect(zoomTarget).toHaveText('9')
  await expect(page.getByLabel(zoomInLabel)).toBeDisabled()
})

test('zoom out button zooms out until min zoom', async ({ page }) => {
  const zoomOutLabel = 'Zoom out'
  await openSnowbox(page)

  const zoomTarget = page.locator(zoomTargetId)
  await expect(zoomTarget).toHaveText('2')
  await clickTimes({ page, value: zoomOutLabel, times: 2 })
  await expect(zoomTarget).toHaveText('0')
  await expect(page.getByLabel(zoomOutLabel)).toBeDisabled()
})
