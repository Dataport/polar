import type { Icon, PluginOptions } from '@/core'

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
	 */
	zoomIn?: Icon

	/**
	 * Icon for the zoom-out button.
	 */
	zoomOut?: Icon
}

/**
 * Plugin options for zoom plugin.
 */
export interface ZoomPluginOptions extends PluginOptions {
	/**
	 * Override the default icons for the zoom buttons.
	 */
	icons?: ZoomIconOptions

	/**
	 * Orientation of the UI elements.
	 *
	 * @defaultValue `'horizontal'`
	 * @alpha
	 */
	orientation?: 'horizontal' | 'vertical'

	/**
	 * Render type.
	 *
	 * @defaultValue `'independent'`
	 */
	renderType?: 'independent' | 'iconMenu'

	/**
	 * Defines if the zoom buttons should be visible on small devices.
	 *
	 * @defaultValue `false`
	 */
	showMobile?: boolean

	/**
	 * Defines if a zoom slider is offered in addition to the zoom buttons.
	 * The zoom slider is (regardless of this setting) only offered if there is enough space.
	 *
	 * @defaultValue `false`
	 */
	showZoomSlider?: boolean
}
