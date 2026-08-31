/**
 * Shared UI selectors and accessibility labels used across step definitions.
 *
 * Keeping these in one place removes the duplication that previously existed
 * between the zoom and pins step files and gives a single point of truth when
 * the client markup changes.
 */

/** Accessible label of the map zoom-in control. */
export const ZOOM_IN_LABEL = 'Zoom in'

/** Accessible label of the map zoom-out control. */
export const ZOOM_OUT_LABEL = 'Zoom out'

/** Snowbox vuex debug target showing the current zoom level. */
export const SNOWBOX_ZOOM_TARGET_ID = '#vuex-target-zoom'

/** Snowbox vuex debug target showing the current pin coordinate. */
export const SNOWBOX_PIN_TARGET_ID = '#vuex-target-pin-coordinate'

/** Selector matching the map rendering canvas. */
export const CANVAS_SELECTOR = 'canvas'
