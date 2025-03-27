// it is what it is – a test file, specifically
/* eslint-disable max-lines-per-function */
import { test } from '@playwright/test'
import { openDiPlan } from './utils/openDiplan'

const drawTargetId = 'subscribed-draw'

test('drawn polygons can be cut', async ({ page }) => {
  await openDiPlan(page)

  const canvas = await page.locator('canvas')
  const boundingBox = await canvas.boundingBox()
  if (boundingBox === null) throw new Error('Canvas not found.')
  const { width, height } = boundingBox
  let { x, y } = boundingBox

  x += width / 2
  y += height / 2

  await page.getByLabel('Digitalisierungswerkzeuge').click()
  await page.getByLabel('Neue Fläche einzeichnen').click()

  // canvas not fully visible initially
  await canvas.scrollIntoViewIfNeeded()
  const scrollY = await page.evaluate(() => window.scrollY)
  y -= scrollY

  const moves: [number, number, string][] = [
    [-40, 0, 'click'],
    [40, -40, 'click'],
    [40, 40, 'click'],
    [-40, 40, 'dblclick'],
  ]

  for (const [xMove, yMove, method] of moves) {
    await page.mouse[method]((x += xMove), (y += yMove))
  }

  await page.getByLabel('Durchschneiden').click()

  const cut: [number, number, string][] = [
    [-80, -40, 'click'],
    [160, 0, 'dblclick'],
  ]

  for (const [xMove, yMove, method] of cut) {
    await page.mouse[method]((x += xMove), (y += yMove))
  }

  await page.waitForFunction(
    (id) =>
      document.getElementById(id)?.innerText !== 'uninitialized' &&
      JSON.parse(document.getElementById(id)?.innerText || '').features
        .length === 2,
    drawTargetId,
    { timeout: 5000 }
  )
})
