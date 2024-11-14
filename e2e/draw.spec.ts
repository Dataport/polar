import { test, expect } from '@playwright/test'
import { openSnowbox } from './utils/openSnowbox'

const drawTargetId = '#vuex-target-draw-result'

test('clicks to the map produce a fetchable pin coordinate', async ({
  page,
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
  await page.getByText('Draw and write').click()
  await page.getByText('Polygon').click()

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

test('two features drawn at the same coordinate can be modified separately', async ({
  page,
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
  await page.getByText('Draw and write').click()
  await page.getByText('Point').click()

  await page.mouse.click(x, y)
  await page.mouse.click(x, y)

  await page.getByText('Edit').click()

  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + 40, y + 40)
  await page.mouse.up()

  const drawing = JSON.parse(await page.locator(drawTargetId).innerText())

  expect(drawing.type).toBe('FeatureCollection')
  expect(drawing.features.length).toBe(2)
  expect(drawing.features[0].geometry.coordinates[0]).toBe(x)
  expect(drawing.features[0].geometry.coordinates[1]).toBe(y)
  expect(drawing.features[1].geometry.coordinates[0]).toBe(x + 40)
  expect(drawing.features[1].geometry.coordinates[1]).toBe(y + 40)
})
