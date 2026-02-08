import { expect, type Page } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { saveScreenshot, saveAllPinsScreenshots } from './screenshot-utils'

const { Given, When, Then } = createBdd()

type Clip = { x: number; y: number; width: number; height: number }

type CanvasBox = { x: number; y: number; width: number; height: number }

type PinsContext = {
  pins?: {
    canvasBox?: CanvasBox
    clickPosition?: { x: number; y: number }
    centerPosition?: { x: number; y: number }
    beforeClickClip?: Buffer
    beforeCenterClip?: Buffer
    afterClickClip?: Buffer
    loadingCenterClip?: Buffer
    stabilizedCenterClip?: Buffer
  }
}

const CANVAS_SELECTOR = 'canvas'
const CLIP_SIZE = 60
const ZOOM_IN_LABEL = 'Zoom in'
const ZOOM_OUT_LABEL = 'Zoom out'
const SNOWBOX_ZOOM_TARGET_ID = '#vuex-target-zoom'
const SNOWBOX_PIN_TARGET_ID = '#vuex-target-pin-coordinate'

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

async function getCanvasBox(page: Page): Promise<CanvasBox> {
  const box = await page.locator(CANVAS_SELECTOR).first().boundingBox()
  expect(box, 'Expected a canvas to be present').toBeTruthy()
  return box as CanvasBox
}

function getCenterPosition(box: { width: number; height: number }): {
  x: number
  y: number
} {
  return {
    x: Math.floor(box.width / 2),
    y: Math.floor(box.height / 2),
  }
}

function toCanvasPositionFromCenter(
  canvasBox: CanvasBox,
  cartesian: { x: number; y: number }
): { x: number; y: number } {
  const center = getCenterPosition(canvasBox)
  const desiredX = center.x + cartesian.x
  const desiredY = center.y - cartesian.y

  return {
    x: clamp(Math.round(desiredX), 0, canvasBox.width - 1),
    y: clamp(Math.round(desiredY), 0, canvasBox.height - 1),
  }
}

function toClipAround(
  canvasBox: CanvasBox,
  position: { x: number; y: number },
  size = CLIP_SIZE
): Clip {
  const half = Math.floor(size / 2)
  // position is relative to the canvas; clip is absolute to the page
  const desiredLeft = canvasBox.x + position.x - half
  const desiredTop = canvasBox.y + position.y - half

  const left = clamp(
    desiredLeft,
    canvasBox.x,
    canvasBox.x + canvasBox.width - size
  )
  const top = clamp(
    desiredTop,
    canvasBox.y,
    canvasBox.y + canvasBox.height - size
  )

  return { x: Math.floor(left), y: Math.floor(top), width: size, height: size }
}

const screenshotClip = (page: Page, clip: Clip): Promise<Buffer> =>
  page.screenshot({ clip })

async function ensureZoomLevel(page: Page, targetLevel: number) {
  const zoomTarget = page.locator(SNOWBOX_ZOOM_TARGET_ID)
  if ((await zoomTarget.count()) === 0) {
    throw new Error('Zoom level target not found on page')
  }

  const getLevel = async () => {
    const text = (await zoomTarget.textContent())?.trim()
    const parsed = Number.parseInt(text ?? '', 10)
    if (Number.isNaN(parsed)) {
      throw new Error('Zoom level target did not contain a number')
    }
    return parsed
  }

  let current = await getLevel()
  let attempts = 0
  while (current !== targetLevel && attempts < 20) {
    if (current < targetLevel) {
      await page.getByLabel(ZOOM_IN_LABEL).click()
    } else {
      await page.getByLabel(ZOOM_OUT_LABEL).click()
    }
    await page.waitForTimeout(150)
    current = await getLevel()
    attempts += 1
  }

  if (current !== targetLevel) {
    throw new Error(
      `Failed to reach zoom level ${targetLevel}. Current: ${current}`
    )
  }

  await page.waitForTimeout(3000)
}

async function waitForStableClip(
  page: Page,
  clip: Clip,
  maxAttempts = 10,
  delayMs = 300
): Promise<Buffer> {
  let previous = await screenshotClip(page, clip)
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    await page.waitForTimeout(delayMs)
    const current = await screenshotClip(page, clip)
    if (current.equals(previous)) {
      return current
    }
    previous = current
  }
  return previous
}

/**
 * Ensures that no pin coordinate is set before any interaction.
 *
 * This is implemented as a black-box baseline capture: we store a small screenshot
 * around the canvas center (and the full canvas box) so later steps can detect
 * visual changes after click interactions.
 */
Given('no pin coordinate is set', async function ({ page }) {
  const world = this as unknown as PinsContext
  world.pins = world.pins || {}

  // Let the map finish initial rendering/tiles.
  await page.waitForTimeout(250)

  const coordinateTarget = page.locator(SNOWBOX_PIN_TARGET_ID)
  await expect(coordinateTarget).toBeEmpty()

  const canvasBox = await getCanvasBox(page)
  world.pins.canvasBox = canvasBox
  world.pins.centerPosition = getCenterPosition(canvasBox)

  const centerClip = toClipAround(canvasBox, world.pins.centerPosition)
  world.pins.beforeCenterClip = await screenshotClip(page, centerClip)
})

/**
 * Zooms the map to a specific level.
 *
 * @param {number} level - The target zoom level to set on the map.
 */
Given(
  'the map is zoomed to level {int}',
  async function ({ page }, level: number) {
    await ensureZoomLevel(page, level)
  }
)

When(
  'the map is clicked at coordinates [{int}, {int}]',
  async function ({ page }, x: number, y: number) {
    const world = this as unknown as PinsContext
    world.pins = world.pins || {}

    const canvasBox = world.pins.canvasBox || (await getCanvasBox(page))
    world.pins.canvasBox = canvasBox

    if (Math.abs(x) < CLIP_SIZE && Math.abs(y) < CLIP_SIZE) {
      throw new Error(
        'Click coordinates are too close to center; use a larger offset to avoid overlapping clips.'
      )
    }

    const clickPosition = toCanvasPositionFromCenter(canvasBox, { x, y })
    world.pins.clickPosition = clickPosition
    world.pins.centerPosition =
      world.pins.centerPosition || getCenterPosition(canvasBox)

    await page.waitForTimeout(150)
    world.pins.beforeClickClip = await screenshotClip(
      page,
      toClipAround(canvasBox, clickPosition)
    )
    world.pins.beforeCenterClip = await screenshotClip(
      page,
      toClipAround(canvasBox, world.pins.centerPosition)
    )

    await page
      .locator(CANVAS_SELECTOR)
      .first()
      .click({ position: clickPosition })

    // Wait for loading overlay to appear and then disappear
    await page.waitForSelector('text=Loading...', { timeout: 2000 })

    world.pins.afterClickClip = await waitForStableClip(
      page,
      toClipAround(canvasBox, clickPosition)
    )

    world.pins.loadingCenterClip = await screenshotClip(
      page,
      toClipAround(canvasBox, world.pins.centerPosition)
    )
    expect(world.pins.loadingCenterClip).not.toEqual(
      world.pins.beforeCenterClip
    )

    await page.waitForSelector('text=Loading...', {
      state: 'hidden',
      timeout: 5000,
    })

    world.pins.stabilizedCenterClip = await waitForStableClip(
      page,
      toClipAround(canvasBox, world.pins.centerPosition)
    )
  }
)

When('the map is clicked at the center coordinates', async function ({ page }) {
  const world = this as unknown as PinsContext
  world.pins = world.pins || {}

  const canvasBox = world.pins.canvasBox || (await getCanvasBox(page))
  world.pins.canvasBox = canvasBox

  const centerPosition =
    world.pins.centerPosition || getCenterPosition(canvasBox)
  world.pins.centerPosition = centerPosition
  world.pins.clickPosition = centerPosition

  await page.waitForTimeout(150)
  world.pins.beforeClickClip = await screenshotClip(
    page,
    toClipAround(canvasBox, centerPosition)
  )
  world.pins.beforeCenterClip = await screenshotClip(
    page,
    toClipAround(canvasBox, centerPosition)
  )

  await page
    .locator(CANVAS_SELECTOR)
    .first()
    .click({ position: centerPosition })

  // Wait for loading overlay to appear and then disappear
  await page.waitForSelector('text=Loading...', { timeout: 2000 })

  world.pins.afterClickClip = await waitForStableClip(
    page,
    toClipAround(canvasBox, centerPosition)
  )

  world.pins.loadingCenterClip = await screenshotClip(
    page,
    toClipAround(canvasBox, world.pins.centerPosition)
  )
  expect(world.pins.loadingCenterClip).not.toEqual(world.pins.beforeCenterClip)

  await page.waitForSelector('text=Loading...', {
    state: 'hidden',
    timeout: 5000,
  })

  world.pins.stabilizedCenterClip = await waitForStableClip(
    page,
    toClipAround(canvasBox, world.pins.centerPosition)
  )
})

Then('the pin location should be set to some value', async function () {
  const world = this as unknown as PinsContext
  const pins = world.pins

  if (!pins?.canvasBox) {
    throw new Error('Missing canvas box; did the map load?')
  }
  if (!pins.clickPosition) {
    throw new Error('Missing click position; did a click step run?')
  }
  if (!pins.beforeClickClip) {
    throw new Error('Missing baseline clip; did the click step run?')
  }
  if (!pins.afterClickClip) {
    throw new Error('Missing post-click clip; did the click step run?')
  }

  try {
    expect(pins.afterClickClip).not.toEqual(pins.beforeClickClip)
  } catch (error) {
    await saveAllPinsScreenshots(pins, 'pin-location-set')
    throw error
  }
})

Then('a pin should be displayed at the center coordinates', async function () {
  const world = this as unknown as PinsContext
  const pins = world.pins

  if (!pins?.canvasBox) {
    throw new Error('Missing canvas box; did the map load?')
  }
  if (!pins.centerPosition) {
    throw new Error('Missing center position; did a click step run?')
  }
  if (!pins.beforeCenterClip) {
    throw new Error('Missing baseline center clip; did a Given/When step run?')
  }
  if (!pins.afterClickClip) {
    throw new Error('Missing post-click clip; did the click step run?')
  }
  if (!pins.stabilizedCenterClip) {
    throw new Error('Missing stabilized center clip; did the click step run?')
  }

  try {
    expect(pins.stabilizedCenterClip).toEqual(pins.afterClickClip)
  } catch (error) {
    await saveAllPinsScreenshots(pins, 'pin-at-center')
    throw error
  }
})
