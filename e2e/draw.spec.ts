import { expect, test } from '@playwright/test'
import { drag, draw } from './utils/draw'
import { openSnowbox } from './utils/openSnowbox'

const drawTargetId = 'vuex-target-draw-result'
const drawTargetLocatorString = `#${drawTargetId}`

test('the draw tool can be used to draw polygons on the map', async ({
  page,
  isMobile,
}) => {
  await openSnowbox(page)

  await page.getByLabel('Draw tools').click()
  await page.getByText('Draw, write and measure').click()
  await page.getByText('Polygon', { exact: true }).click()

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

  const drawing = JSON.parse(
    await page.locator(drawTargetLocatorString).innerText()
  )

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
  await page.getByText('Point', { exact: true }).click()

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

  const drawing = JSON.parse(
    await page.locator(drawTargetLocatorString).innerText()
  )

  expect(drawing.type).toBe('FeatureCollection')
  expect(drawing.features.length).toBe(2)
  expect(drawing.features[0].geometry.coordinates[0]).not.toBe(
    drawing.features[1].geometry.coordinates[0]
  )
  expect(drawing.features[0].geometry.coordinates[1]).not.toBe(
    drawing.features[1].geometry.coordinates[1]
  )
})

test('drawn polygons can be cut', async ({ page, isMobile }) => {
  await openSnowbox(page)

  await page.getByLabel('Draw tools').click()
  await page.getByText('Draw, write and measure').click()
  await page.getByText('Polygon', { exact: true }).click()

  if (isMobile) {
    // menu gets in the way in mobile
    await page.getByLabel('Draw tools').click()
    await expect(page.locator('.polar-draw-menu')).toHaveCount(0)
  }

  await draw(page, [
    [-40, 0, 'click'],
    [40, -40, 'click'],
    [40, 40, 'click'],
    [-40, 40, 'dblclick'],
  ])

  if (isMobile) {
    await page.getByLabel('Draw tools').click()
    await expect(page.locator('.polar-draw-menu')).toHaveCount(1)
  }

  await page.getByText('Cut polygons').click()

  if (isMobile) {
    await page.getByLabel('Draw tools').click()
    await expect(page.locator('.polar-draw-menu')).toHaveCount(0)
  }

  await draw(page, [
    [-80, 0, 'click'],
    [160, 0, 'dblclick'],
  ])

  await page.waitForFunction(
    (id) =>
      document.getElementById(id)?.innerText !== 'uninitialized' &&
      JSON.parse(document.getElementById(id)?.innerText || '').features
        .length === 2,
    drawTargetId,
    { timeout: 5000 }
  )
})

test('drawn polygons can be duplicated', async ({ page, isMobile }) => {
  await openSnowbox(page)

  await page.getByLabel('Draw tools').click()
  await page.getByText('Draw, write and measure').click()
  await page.getByText('Polygon', { exact: true }).click()

  if (isMobile) {
    // menu gets in the way in mobile
    await page.getByLabel('Draw tools').click()
    await expect(page.locator('.polar-draw-menu')).toHaveCount(0)
  }

  await draw(page, [
    [-40, 0, 'click'],
    [40, -40, 'click'],
    [40, 40, 'dblclick'],
  ])

  if (isMobile) {
    await page.getByLabel('Draw tools').click()
    await expect(page.locator('.polar-draw-menu')).toHaveCount(1)
  }

  await page.getByText('Duplicate').click()

  if (isMobile) {
    await page.getByLabel('Draw tools').click()
    await expect(page.locator('.polar-draw-menu')).toHaveCount(0)
  }

  await draw(page, [[0, -20, 'click']])

  await page.waitForFunction(
    (id) =>
      document.getElementById(id)?.innerText !== 'uninitialized' &&
      JSON.parse(document.getElementById(id)?.innerText || '').features
        .length === 2,
    drawTargetId,
    { timeout: 5000 }
  )
})

test('drawn polygons can be merged', async ({ page, isMobile }) => {
  await openSnowbox(page)

  await page.getByLabel('Draw tools').click()
  await page.getByText('Draw, write and measure').click()
  await page.getByText('Polygon', { exact: true }).click()

  if (isMobile) {
    await page.getByLabel('Draw tools').click()
    await expect(page.locator('.polar-draw-menu')).toHaveCount(0)
  }

  await draw(page, [
    [-40, 0, 'click'],
    [0, -40, 'click'],
    [-40, 40, 'dblclick'],
  ])

  await draw(page, [
    [40, 0, 'click'],
    [40, 0, 'click'],
    [-40, -40, 'dblclick'],
  ])

  if (isMobile) {
    await page.getByLabel('Draw tools').click()
    await expect(page.locator('.polar-draw-menu')).toHaveCount(1)
  }

  await page.getByText('Merge polygons').click()

  if (isMobile) {
    await page.getByLabel('Draw tools').click()
    await expect(page.locator('.polar-draw-menu')).toHaveCount(0)
  }

  await draw(page, [
    [60, -20, 'click'],
    [-120, 0, 'click'],
    [0, 40, 'click'],
    [120, 0, 'dblclick'],
  ])

  await page.waitForFunction(
    (id) =>
      document.getElementById(id)?.innerText !== 'uninitialized' &&
      JSON.parse(document.getElementById(id)?.innerText || '').features
        .length === 1,
    drawTargetId,
    { timeout: 5000 }
  )
})
