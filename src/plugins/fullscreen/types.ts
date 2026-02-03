import type { PluginOptions } from '@/core'

/**
 * Plugin identifier.
 */
export const PluginId = 'fullscreen'

/**
 * Plugin options for fullscreen plugin.
 */
export interface FullscreenOptions extends PluginOptions {
	/**
	 * Defines if the fullscreen button is rendered independent or as part of the icon menu.
	 *
	 * This is only applicable if the layout is `'nineRegions'`.
	 *
	 * @defaultValue `'independent'`
	 */
	renderType?: 'independent' | 'iconMenu'

	/**
	 * Defines the target container to show in fullscreen mode.
	 * This defaults to the web component (i.e., the map with its plugin controls).
	 *
	 * If a string is provided, it is interpreted as the `id` of an `HTMLElement` which is searched by `document.getElementById`.
	 * For usage within Shadow DOMs, please provide the `HTMLElement` itself.
	 */
	targetContainer?: HTMLElement | string
}
