/**
 * Shared UI selectors and accessibility labels used across step definitions.
 *
 * Keeping these in one place removes the duplication that previously existed
 * between the zoom and pins step files and gives a single point of truth when
 * the client markup changes.
 */

/**
 * Accessible name of the map zoom-in control.
 *
 * POLAR icon buttons carry no `aria-label`; their name comes from a visually
 * hidden label, so they have to be matched via `getByRole`, not `getByLabel`.
 */
export const ZOOM_IN_LABEL = 'Zoom in'

/** Accessible name of the map zoom-out control. */
export const ZOOM_OUT_LABEL = 'Zoom out'

/**
 * Selector for a store value rendered by the example's plugin state debug view.
 *
 * @param store - Name of the store, e.g. `core` or `pins`.
 * @param key - Name of the reactive state field.
 * @returns Selector matching the element holding the serialized value.
 */
export function pluginStateValue(store: string, key: string): string {
	return `#plugin-state-${store}-${key} pre`
}

/** Debug target showing the current zoom level. */
export const ZOOM_STATE_SELECTOR = pluginStateValue('core', 'zoom')

/** Debug target showing the current pin coordinate. */
export const PIN_COORDINATE_STATE_SELECTOR = pluginStateValue(
	'pins',
	'coordinate'
)

/** Selector matching the map rendering canvas. */
export const CANVAS_SELECTOR = 'canvas'

/** Selector matching the canvas of a fully rendered POLAR map. */
export const MAP_CANVAS_SELECTOR = 'polar-map canvas'

/** Selector of the icon menu list. */
export const ICON_MENU_LIST_SELECTOR = 'ul.polar-plugin-icon-menu-list'

/** Selector of the icon buttons within the icon menu list. */
export const ICON_MENU_BUTTON_SELECTOR = 'button.polar-icon-button'

/** Selector of the loading indicator overlay shown while a request is pending. */
export const LOADING_INDICATOR_SELECTOR =
	'.polar-plugin-loading-indicator-wrapper'

/** Accessible name of the icon menu button toggling the layer chooser. */
export const LAYER_CHOOSER_BUTTON_LABEL = 'Choose map'

/** Selector of a single layer chooser entry. */
export const LAYER_CHOOSER_ENTRY_SELECTOR = '.polar-layer-chooser-input-wrapper'

/** Selector of a single toast notification. */
export const TOAST_SELECTOR = '.kern-alert[role="alert"]'

/** Selector of the dismiss button within a toast notification. */
export const TOAST_DISMISS_BUTTON_SELECTOR = 'button.kern-btn'

/** Name of the background layer backed by the mock map server. */
export const MOCK_MAP_LAYER_NAME = 'Mock Map (E2E)'
