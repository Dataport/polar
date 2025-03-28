import { Page } from '@playwright/test'

/**
 * Always starts at canvas center.
 * @param page Playwright.Page
 * @param events [xMove, yMove, Playwright.Mouse.Method][] – chainable clicks, coordinate movement is additive for follow-up coordinates, i.e. "you literally move the mouse by x/y per step"
 */
export const draw = async (page: Page, events: [number, number, string][]) => {
  const canvas = await page.locator('canvas')
  await canvas.scrollIntoViewIfNeeded()
  const boundingBox = await canvas.boundingBox()
  if (boundingBox === null) throw new Error('Canvas not found.')
  const { width, height } = boundingBox
  let { x, y } = boundingBox

  x += width / 2
  y += height / 2

  for (const [xMove, yMove, method] of events) {
    await page.mouse[method]((x += xMove), (y += yMove))
  }
}
