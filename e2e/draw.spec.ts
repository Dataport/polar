import { test, expect } from '@playwright/test'
import { openSnowbox } from './utils/openSnowbox'

const drawTargetId = '#vuex-target-draw-result'

test('the draw tool can be used to draw polygons on the map', async ({
  page,
  isMobile,
}) => {
  await openSnowbox(page)

  const canvas = await page.locator('canvas')
  const boundingBox = await canvas.boundingBox()
  if (boundingBox === null) throw new Error('Canvas not found.')
  const { width, height } = boundingBox
  let { x, y } = boundingBox

  x += width / 2
  y += height / 2

  await page.getByLabel('Draw tools').click()
  await page.getByText('Draw, write and measure').click()
  await page.getByText('Polygon').click()

  if (isMobile) {
    // menu gets in the way in mobile
    await page.getByLabel('Draw tools').click()
    await expect(page.locator('.polar-draw-menu')).toHaveCount(0)
    // canvas not fully visible initially in mobile
    await canvas.scrollIntoViewIfNeeded()
    const scrollY = await page.evaluate(() => window.scrollY)
    y -= scrollY
  }

  const moves: [number, number, string][] = [
    [0, 0, 'click'],
    [40, -40, 'click'],
    [40, 40, 'click'],
    [-80, 80, 'click'],
    [-80, -80, 'click'],
    [40, -40, 'dblclick'],
  ]

  for (const [xMove, yMove, method] of moves) {
    await page.mouse[method]((x += xMove), (y += yMove))
  }

  const drawing = JSON.parse(await page.locator(drawTargetId).innerText())

  expect(drawing.type).toBe('FeatureCollection')
  expect(drawing.features.length).toBe(1)
  expect(drawing.features[0].geometry.coordinates[0].length).toBe(7)
})

// it's fiiine
// eslint-disable-next-line max-lines-per-function
test('two features drawn at the same coordinate can be modified separately', async ({
  page,
  isMobile,
}) => {
  await openSnowbox(page)

  const canvas = await page.locator('canvas')
  const boundingBox = await canvas.boundingBox()
  if (boundingBox === null) throw new Error('Canvas not found.')
  const { width, height } = boundingBox
  let { x, y } = boundingBox

  x += width / 2
  y += height / 2

  await page.getByLabel('Draw tools').click()
  await page.getByText('Draw, write and measure').click()
  await page.getByText('Point').click()

  if (isMobile) {
    // menu gets in the way in mobile
    await page.getByLabel('Draw tools').click()
    await expect(page.locator('.polar-draw-menu')).toHaveCount(0)
  }

  await page.mouse.click(x, y)
  await page.mouse.click(x, y)

  if (isMobile) {
    await page.getByLabel('Draw tools').click()
    await expect(page.locator('.polar-draw-menu')).toHaveCount(1)
  }

  await page.getByText('Edit').click()

  if (isMobile) {
    await page.getByLabel('Draw tools').click()
    await expect(page.locator('.polar-draw-menu')).toHaveCount(0)
  }

  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x - 40, y - 40)
  await page.mouse.up()

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
