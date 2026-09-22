import type { Icon, PlaceablePluginOptions } from '@/core'

/**
 * Plugin identifier.
 */
export const PluginId = 'zoom'

/**
 * Override options for icons used within the zoom plugin.
 */
export interface ZoomIconOptions {
	/**
	 * Icon for the zoom-in button.
	 * @defaultValue 'kern-icon--zoom-in'
	 */
	zoomIn?: Icon

	/**
	 * Icon for the zoom-out button.
	 * @defaultValue 'kern-icon--zoom-out'
	 */
	zoomOut?: Icon
}

/**
 * Plugin options for zoom plugin.
 */
export interface ZoomPluginOptions extends PlaceablePluginOptions {
	/**
	 * Override the default icons for the zoom buttons.
	 * @defaultValue `{ zoomIn: 'kern-icon--zoom-in', zoomOut: 'kern-icon--zoom-out' }`
	 */
	icons?: ZoomIconOptions

	/**
	 * Defines if the zoom buttons and slider should be visible on small devices.
	 *
	 * @defaultValue `false`
	 */
	showMobile?: boolean

	/**
	 * Defines if a zoom slider is offered in addition to the zoom buttons.
	 * The zoom slider is (regardless of this setting) only displayed if there is enough space.
	 *
	 * @defaultValue `false`
	 */
	showZoomSlider?: boolean
}
