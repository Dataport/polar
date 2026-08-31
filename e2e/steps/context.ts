/**
 * Shared state that needs to be carried across steps within a single scenario.
 *
 * Each scenario runs against its own Playwright `page`, so keying the state by
 * the `page` instance keeps values isolated between parallel tests. This
 * replaces the previous untyped `this`-world casts (`this as unknown as ...`)
 * with a typed, explicit accessor.
 */
import type { Locator } from '@playwright/test'

/** Bounding box of the map canvas in absolute page coordinates. */
export type CanvasBox = { x: number; y: number; width: number; height: number }

/**
 * Screenshot-based state captured while exercising the pin-drop flow. Clips are
 * small canvas crops used to detect visual changes before/after interactions.
 */
export type PinsState = {
  canvasBox?: CanvasBox
  clickPosition?: { x: number; y: number }
  centerPosition?: { x: number; y: number }
  beforeClickClip?: Buffer
  beforeCenterClip?: Buffer
  afterClickClip?: Buffer
  loadingCenterClip?: Buffer
  stabilizedCenterClip?: Buffer
}

/** Per-scenario pins state, keyed by the Playwright `page`. */
const pinsStates = new WeakMap<object, PinsState>()

/**
 * Returns the pins state for the given page, creating an empty one on first use.
 *
 * @param page - Active Playwright page instance (used as the isolation key).
 * @returns The mutable pins state for this scenario.
 */
export function getPinsState(page: object): PinsState {
  let state = pinsStates.get(page)
  if (!state) {
    state = {}
    pinsStates.set(page, state)
  }
  return state
}

/** Modal locator remembered across steps of the dish modal flow. */
const modalLocators = new WeakMap<object, Locator>()

/**
 * Stores the modal locator for later steps in the same scenario.
 *
 * @param page - Active Playwright page instance (used as the isolation key).
 * @param locator - Locator pointing at the currently open modal.
 */
export function setModalLocator(page: object, locator: Locator): void {
  modalLocators.set(page, locator)
}

/**
 * Returns the previously stored modal locator or throws a descriptive error.
 *
 * @param page - Active Playwright page instance (used as the isolation key).
 * @returns The modal locator saved by the "the modal is opened" step.
 */
export function getModalLocator(page: object): Locator {
  const locator = modalLocators.get(page)
  if (!locator) {
    throw new Error(
      'No modal locator stored; did the "the modal is opened" step run?'
    )
  }
  return locator
}
