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
export interface CanvasBox {
	height: number
	width: number
	x: number
	y: number
}

/**
 * Screenshot-based state captured while exercising the pin-drop flow. Clips are
 * small canvas crops used to detect visual changes before/after interactions.
 */
export interface PinsState {
	afterClickClip?: Buffer
	beforeCenterClip?: Buffer
	beforeClickClip?: Buffer
	canvasBox?: CanvasBox
	centerPosition?: { x: number; y: number }
	clickPosition?: { x: number; y: number }
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

/** Per-scenario background layer selection, keyed by the Playwright `page`. */
const selectedLayerIds = new WeakMap<object, string>()

/**
 * Remembers which background layer a scenario switched to.
 *
 * @param page - Active Playwright page instance (used as the isolation key).
 * @param layerId - Id of the newly selected background layer.
 */
export function setSelectedLayerId(page: object, layerId: string): void {
	selectedLayerIds.set(page, layerId)
}

/**
 * Returns the previously selected background layer id or throws a descriptive
 * error.
 *
 * @param page - Active Playwright page instance (used as the isolation key).
 * @returns The layer id saved by the "a new layer is selected" step.
 */
export function getSelectedLayerId(page: object): string {
	const layerId = selectedLayerIds.get(page)
	if (!layerId) {
		throw new Error(
			'No layer stored; did the "a new layer is selected" step run?'
		)
	}
	return layerId
}

/**
 * Rendering baseline captured before a background layer is switched, used to
 * prove that the switch is visible on the map and not just in the plugin state.
 */
export interface BackgroundRenderState {
	fingerprint: string
	initialBackgroundId: string
}

/** Per-scenario background rendering baseline, keyed by the Playwright `page`. */
const backgroundRenderStates = new WeakMap<object, BackgroundRenderState>()

/**
 * Remembers how the map center looked while the initial background was active.
 *
 * @param page - Active Playwright page instance (used as the isolation key).
 * @param state - Map fingerprint and id of the active background layer.
 */
export function setBackgroundRenderState(
	page: object,
	state: BackgroundRenderState
): void {
	backgroundRenderStates.set(page, state)
}

/**
 * Returns the previously captured background rendering baseline or throws a
 * descriptive error.
 *
 * @param page - Active Playwright page instance (used as the isolation key).
 * @returns The baseline saved by the "the rendered map is remembered" step.
 */
export function getBackgroundRenderState(page: object): BackgroundRenderState {
	const state = backgroundRenderStates.get(page)
	if (!state) {
		throw new Error(
			'No map rendering baseline stored; did the "the rendered map is ' +
				'remembered" step run?'
		)
	}
	return state
}

/** Pointer position captured before a projection switch, keyed by the `page`. */
const pointerPositions = new WeakMap<object, string>()

/**
 * Remembers the formatted pointer position currently on screen.
 *
 * @param page - Active Playwright page instance (used as the isolation key).
 * @param position - Formatted coordinate as rendered by the plugin.
 */
export function setPointerPosition(page: object, position: string): void {
	pointerPositions.set(page, position)
}

/**
 * Returns the previously captured pointer position or throws a descriptive error.
 *
 * @param page - Active Playwright page instance (used as the isolation key).
 * @returns The coordinate saved before the projection was switched.
 */
export function getPointerPosition(page: object): string {
	const position = pointerPositions.get(page)
	if (!position) {
		throw new Error(
			'No pointer position stored; did the projection switch step run?'
		)
	}
	return position
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
