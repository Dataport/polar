import { test, expect } from '@playwright/test'
import { openSnowbox } from './utils/openSnowbox'
import { draw, drag } from './utils/draw'

const drawTargetId = '#vuex-target-draw-result'

test('the draw tool can be used to draw polygons on the map', async ({
  page,
  isMobile,
}) => {
  await openSnowbox(page)

  await page.getByLabel('Draw tools').click()
  await page.getByText('Draw, write and measure').click()
  await page.getByText('Polygon').click()

  if (isMobile) {
    // menu gets in the way in mobile
    await page.getByLabel('Draw tools').click()
    await expect(page.locator('.polar-draw-menu')).toHaveCount(0)
  }

  await draw(page, [
    [0, 0, 'click'],
    [40, -40, 'click'],
    [40, 40, 'click'],
    [-80, 80, 'click'],
    [-80, -80, 'click'],
    [40, -40, 'dblclick'],
  ])

  const drawing = JSON.parse(await page.locator(drawTargetId).innerText())

  expect(drawing.type).toBe('FeatureCollection')
  expect(drawing.features.length).toBe(1)
  expect(drawing.features[0].geometry.coordinates[0].length).toBe(7)
})

test('two features drawn at the same coordinate can be modified separately', async ({
  page,
  isMobile,
}) => {
  await openSnowbox(page)

  await page.getByLabel('Draw tools').click()
  await page.getByText('Draw, write and measure').click()
  await page.getByText('Point').click()

  if (isMobile) {
    // menu gets in the way in mobile
    await page.getByLabel('Draw tools').click()
    await expect(page.locator('.polar-draw-menu')).toHaveCount(0)
  }

  await draw(page, [
    [0, 0, 'click'],
    [0, 0, 'click'],
  ])

  if (isMobile) {
    await page.getByLabel('Draw tools').click()
    await expect(page.locator('.polar-draw-menu')).toHaveCount(1)
  }

  await page.getByText('Edit').click()

  if (isMobile) {
    await page.getByLabel('Draw tools').click()
    await expect(page.locator('.polar-draw-menu')).toHaveCount(0)
  }

  await drag(page, [
    [0, 0],
    [-40, -40],
  ])

  const drawing = JSON.parse(await page.locator(drawTargetId).innerText())

  expect(drawing.type).toBe('FeatureCollection')
  expect(drawing.features.length).toBe(2)
  expect(drawing.features[0].geometry.coordinates[0]).not.toBe(
    drawing.features[1].geometry.coordinates[0]
  )
  expect(drawing.features[0].geometry.coordinates[1]).not.toBe(
    drawing.features[1].geometry.coordinates[1]
  )
})
