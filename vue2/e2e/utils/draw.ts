import { Page } from '@playwright/test'

const getCanvasCenter = async (page: Page) => {
  const canvas = await page.locator('canvas')
  await canvas.scrollIntoViewIfNeeded()
  const boundingBox = await canvas.boundingBox()
  if (boundingBox === null) throw new Error('Canvas not found.')
  const { width, height } = boundingBox
  let { x, y } = boundingBox

  x += width / 2
  y += height / 2

  return [x, y]
}

/**
 * Always starts at canvas center.
 * @param page Playwright.Page
 * @param events [xMove, yMove, Playwright.Mouse.Method][] – chainable clicks, coordinate movement is additive for follow-up coordinates, i.e. "you literally move the mouse by x/y per step". Only for methods supporting x/y coordinate as parameters. (click, dblclick, move, wheel)
 */
export const draw = async (page: Page, events: [number, number, string][]) => {
  let [x, y] = await getCanvasCenter(page)

  for (const [xMove, yMove, method] of events) {
    await page.mouse[method]((x += xMove), (y += yMove))
  }
}

/**
 * Always starts at canvas center.
 * @param page Playwright.Page
 * @param fromTo [[startX, startY], [endX, endY]] - start and end coordinate of drag relative to canvas center
 */
export const drag = async (
  page: Page,
  [[startX, startY], [endX, endY]]: [[number, number], [number, number]]
) => {
  let [x, y] = await getCanvasCenter(page)

  await page.mouse.move((x += startX), (y += startY))
  await page.mouse.down()
  await page.mouse.move((x += endX), (y += endY))
  await page.mouse.up()
}
