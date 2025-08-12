import type { Component } from 'vue'
import type { PluginContainer, PluginOptions } from '@/core'
import type { NineLayoutTag } from '@/core/utils/NineLayoutTag.ts'

/**
 * Plugin identifier.
 */
export const PluginId = '@polar/polar/plugins/iconMenu'

export interface Menu {
	/**
	 * Unique identifier of the plugin. Also used to resolve hint locale.
	 */
	id: string
	/**
	 * The plugin that should be part of the icon menu.
	 */
	plugin: PluginContainer
	/**
	 * Overrides the default hint displayed for the icon menu button.
	 * Ff not given the locale in `plugins.iconMenu.hints.${id}` is used.
	 */
	hint?: string
	/**
	 * Icon for icon menu button. If given, render a button with the icon. When
	 * clicked, open the content of the configured plugin. If not given, render
	 * the plugin content as is inside the IconMenu.
	 *
	 * Current examples for the usage without icon include Zoom and Fullscreen.
	 */
	icon?: string
	position?: 'sidebar' | 'topRight'
}

/**
 * Plugin options for iconMenu plugin.
 */
export interface IconMenuPluginOptions extends PluginOptions {
	/**
	 * Defines which plugins should be rendered as part of the icon menu.
	 *
	 * @example
	 * ```
	 * {
	 *   initiallyOpen: 'draw',
	 *   displayComponent: true,
	 *   menus: [
	 *     {
	 *       plugin: PolarPluginFullscreen({}),
	 *       icon: 'kern-icon--fullscreen',
	 *       id: 'fullscreen',
	 *       position: 'topRight'
	 *     },
	 *     {
	 *       plugin: PolarPluginDraw({}),
	 *       icon: 'kern-icon--draw',
	 *       id: 'draw',
	 *       hint: 'Draw or write something on the map'
	 *       position: 'sidebar'
	 *     },
	 *   ]
	 * }
	 * ```
	 */
	menus: Menu[]
	/**
	 * If {@link MapConfiguration.layout | `mapConfiguration.layers`} is set to `'nineRegions'`, then this parameter
	 * allows overriding the IconMenuButton.vue component for custom design and functionality. Coding knowledge is required
	 * to use this feature, as any implementation will have to rely upon the Pinia store model and has to implement the
	 * same props as the default IconMenuButton.vue. Please refer to the implementation.
	 */
	buttonComponent?: Component
	/**
	 * ID of the plugin which should be open on start; only applicable if the device doesn't have a small display.
	 */
	initiallyOpen?: string
	/**
	 * If {@link MapConfiguration.layout | `mapConfiguration.layers`} is set to `'nineRegions'`, then this parameter
	 * declares the positioning of the IconMenu. However, if {@link buttonComponent} is not set, then only `"TOP_RIGHT"`
	 * is allowed as value.
	 */
	layoutTag?: keyof typeof NineLayoutTag
}
