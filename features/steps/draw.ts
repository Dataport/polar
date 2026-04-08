import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { draw, drag } from './utils/draw'

const { Given, When, Then } = createBdd()

const DRAW_RESULT_ID = 'vuex-target-draw-result'
const DRAW_RESULT_LOCATOR = `#${DRAW_RESULT_ID}`

/**
 * Opens the draw tools panel by clicking the Draw tools button and selecting the draw sub-menu.
 */
Given('the draw tools panel is opened', async function ({ page }) {
  await page.getByLabel('Draw tools').click()
  await page.getByText('Draw, write and measure').click()
})

/**
 * Selects a draw tool from the open draw tools panel.
 *
 * @param tool - The label of the tool to activate (e.g. "Polygon", "Point").
 */
When(
  'the {string} draw tool is selected',
  async function ({ page }, tool: string) {
    await page.getByText(tool, { exact: true }).click()
  }
)

/**
 * Draws a standard six-vertex polygon starting from canvas center.
 * Coordinates are relative and additive per step.
 */
When('a polygon is drawn on the map', async function ({ page }) {
  await draw(page, [
    [0, 0, 'click'],
    [40, -40, 'click'],
    [40, 40, 'click'],
    [-80, 80, 'click'],
    [-80, -80, 'click'],
    [40, -40, 'dblclick'],
  ])
})

/**
 * Draws a polygon suitable for cutting: a 4-vertex rectangle aligned for horizontal cut lines.
 */
When('a polygon suitable for cutting is drawn', async function ({ page }) {
  await draw(page, [
    [-40, 0, 'click'],
    [40, -40, 'click'],
    [40, 40, 'click'],
    [-40, 40, 'dblclick'],
  ])
})

/**
 * Draws a compact three-vertex polygon suitable for duplicate and similar operations.
 */
When('a small polygon is drawn on the map', async function ({ page }) {
  await draw(page, [
    [-40, 0, 'click'],
    [40, -40, 'click'],
    [40, 40, 'dblclick'],
  ])
})

/**
 * Draws two separate polygons on opposite halves of the canvas for merge testing.
 * Each draw call restarts from canvas center.
 */
When('two separate polygons are drawn on the map', async function ({ page }) {
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
})

/**
 * Draws two points at the same canvas location.
 */
When('two points are drawn at the same location', async function ({ page }) {
  await draw(page, [
    [0, 0, 'click'],
    [0, 0, 'click'],
  ])
})

/**
 * Activates the edit mode via the Edit button in the draw tools panel.
 */
When('the edit mode is activated', async function ({ page }) {
  await page.getByText('Edit').click()
})

/**
 * Drags a point from canvas center to a nearby position to separate it from an overlapping point.
 */
When('a point is dragged to a different location', async function ({ page }) {
  await drag(page, [
    [0, 0],
    [-40, -40],
  ])
})

/**
 * Clicks a draw operation button in the draw tools panel.
 *
 * @param operation - The label of the operation to apply (e.g. "Cut polygons", "Duplicate", "Merge polygons").
 */
When(
  'the {string} operation is applied',
  async function ({ page }, operation: string) {
    await page.getByText(operation).click()
  }
)

/**
 * Draws a horizontal cut line through the center of the canvas to split a polygon.
 */
When('a cut line is drawn through the polygon', async function ({ page }) {
  await draw(page, [
    [-80, 0, 'click'],
    [160, 0, 'dblclick'],
  ])
})

/**
 * Places the duplicated feature at a nearby location by clicking once.
 */
When('the duplicate is placed on the map', async function ({ page }) {
  await draw(page, [[0, -20, 'click']])
})

/**
 * Draws a polygon that encompasses both existing polygons to trigger the merge operation.
 */
When('a selection is drawn around both polygons', async function ({ page }) {
  await draw(page, [
    [60, -20, 'click'],
    [-120, 0, 'click'],
    [0, 40, 'click'],
    [120, 0, 'dblclick'],
  ])
})

/**
 * Asserts the current drawing contains the expected number of features.
 *
 * @param count - Expected number of features in the GeoJSON FeatureCollection.
 */
Then(
  'the drawing should contain {int} feature(s)',
  async function ({ page }, count: number) {
    const drawing = JSON.parse(
      await page.locator(DRAW_RESULT_LOCATOR).innerText()
    )
    expect(drawing.type).toBe('FeatureCollection')
    expect(drawing.features.length).toBe(count)
  }
)

/**
 * Asserts the first drawn feature has the expected number of coordinate points.
 *
 * @param points - Expected coordinate count in the first feature's ring geometry.
 */
Then(
  'the drawn polygon should have {int} coordinate points',
  async function ({ page }, points: number) {
    const drawing = JSON.parse(
      await page.locator(DRAW_RESULT_LOCATOR).innerText()
    )
    expect(drawing.features[0].geometry.coordinates[0].length).toBe(points)
  }
)

/**
 * Asserts that two recorded features have different coordinate values from each other.
 */
Then(
  'the two features should have different coordinates',
  async function ({ page }) {
    const drawing = JSON.parse(
      await page.locator(DRAW_RESULT_LOCATOR).innerText()
    )
    expect(drawing.features[0].geometry.coordinates[0]).not.toBe(
      drawing.features[1].geometry.coordinates[0]
    )
    expect(drawing.features[0].geometry.coordinates[1]).not.toBe(
      drawing.features[1].geometry.coordinates[1]
    )
  }
)

/**
 * Polls the DOM until the drawing contains the expected number of features or the timeout expires.
 * Used for operations that update the drawing asynchronously.
 *
 * @param count - Expected number of features in the GeoJSON FeatureCollection.
 */
Then(
  'the drawing should eventually contain {int} feature(s)',
  async function ({ page }, count: number) {
    await page.waitForFunction(
      ([id, expectedCount]) => {
        const el = document.getElementById(id as string)
        if (!el || el.innerText === 'uninitialized') return false
        try {
          return (
            JSON.parse(el.innerText).features.length ===
            (expectedCount as number)
          )
        } catch {
          return false
        }
      },
      [DRAW_RESULT_ID, count],
      { timeout: 5000 }
    )
  }
)
