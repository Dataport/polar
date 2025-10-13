import type { Component } from 'vue'
import type { PluginContainer, PluginOptions } from '@/core'
import type { NineLayoutTag } from '@/core/utils/NineLayoutTag.ts'

export const PluginId = 'iconMenu'

export interface Menu {
	/**
	 * The plugin that should be part of the icon menu.
	 */
	plugin: PluginContainer

	/**
	 * Overrides the default hint displayed for the icon menu button.
	 * If not given, the locale in `hints.${id}` is used.
	 */
	hint?: string

	/**
	 * Icon for icon menu button. If given, render a button with the icon. When clicked, open the content of the
	 * configured plugin. If not given, render the plugin content as is inside the IconMenu.
	 *
	 * Current examples for the usage without icon include Zoom and Fullscreen if
	 * {@link MapConfiguration.layout | `mapConfiguration.layers`} is set to `'nineRegions'`
	 */
	icon?: string
}

/**
 * Plugin options for iconMenu plugin.
 */
export interface IconMenuPluginOptions extends PluginOptions {
	/**
	 * Defines which plugins should be rendered as part of the icon menu.
	 * If {@link MapConfiguration.layout | `mapConfiguration.layers`} is set to `'standard'`, multiple groups can be
	 * added through different arrays to differentiate plugins visually. Using multiple groups (arrays) doesn't yield any
	 * change if {@link MapConfiguration.layout | `mapConfiguration.layers`} is set to `'nineRegions'`.
	 *
	 * @example
	 * ```
	 * {
	 *   initiallyOpen: 'draw',
	 *   displayComponent: true,
	 *   menus: [
	 *     [
	 *       {
	 *         plugin: PolarPluginFullscreen({}),
	 *         icon: 'kern-icon--fullscreen',
	 *         id: 'fullscreen',
	 *       },
	 *       {
	 *         plugin: PolarPluginDraw({}),
	 *         icon: 'kern-icon--draw',
	 *         id: 'draw',
	 *         hint: 'Draw or write something on the map'
	 *       },
	 *     ]
	 *   ]
	 * }
	 * ```
	 */
	menus: Array<Menu[]>

	/**
	 * If {@link MapConfiguration.layout | `mapConfiguration.layers`} is set to `'nineRegions'`, then this parameter
	 * allows overriding the `IconMenuButton.vue` component for custom design and functionality. Coding knowledge is required
	 * to use this feature, as any implementation will have to rely upon the Pinia store model and has to implement the
	 * same props as the default `IconMenuButton.vue`. Please refer to the implementation.
	 */
	buttonComponent?: Component

	/**
	 * ID of the plugin which should be open on start in the {@link focusMenus | `focusMenu`}.
	 *
	 * @remarks
	 * Only applicable if the device doesn't have a small display.
	 */
	focusInitiallyOpen?: string

	/**
	 * If {@link MapConfiguration.layout | `mapConfiguration.layers`} is set to `'standard'`, a second menu that includes
	 * the hints as labels of the buttons is being displayed at the bottom of the map.
	 *
	 * Content is shown in the top left corner.
	 *
	 * @remarks
	 * Plugins like GeoLocation can not be added here, as only plugins containing content are allowed.
	 */
	focusMenus?: (Menu & { icon: string })[]

	/**
	 * ID of the plugin which should be open on start.
	 *
	 * @remarks
	 * Only applicable if the device doesn't have a small display.
	 */
	initiallyOpen?: string

	/**
	 * If {@link MapConfiguration.layout | `mapConfiguration.layers`} is set to `'nineRegions'`, then this parameter
	 * declares the positioning of the IconMenu. However, if {@link buttonComponent} is not set, then only `"TOP_RIGHT"`
	 * is allowed as value.
	 */
	layoutTag?: keyof typeof NineLayoutTag
}
