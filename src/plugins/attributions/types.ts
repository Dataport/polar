import type { PluginOptions, StoreReference } from '@/core'

export const PluginId = 'attributions'

export interface Attribution {
	/**
	 * ID of service the attribution relates to.
	 */
	id: string

	/**
	 * Attribution text or localization key. May contain HTML.
	 * The tags `<YEAR>` and `<MONTH>` are translated to the current year or month respectively.
	 *
	 * @remarks
	 * The text will only be shown when the layer is visible.
	 */
	title: string
}

/**
 * Plugin options for attributions plugin.
 *
 * @example
 * ```ts
 * attributions: {
 *   initiallyOpen: false,
 *   windowWidth: 300,
 *   renderType: 'independent',
 *   listenToChanges: [
 *     {
 *       key: 'zoom',
 *     },
 *     {
 *       key: 'activeBackgroundId',
 *       plugin: 'layerChooser'
 *     },
 *     {
 *       key: 'activeMaskIds',
 *       plugin: 'layerChooser'
 *     },
 *   ],
 *   layerAttributions: [
 *     {
 *       id: 'basemapId',
 *       title: 'Basemap',
 *     },
 *     {
 *       id: 'subway',
 *       title: 'Subway',
 *     },
 *   ],
 *   staticAttributions: [
 *     '<a href="https://www.hamburg.de/impressum/" target="_blank">Impressum</a>',
 *   ],
 * }
 * ```
 *
 * @remarks
 * All parameters are optional. However, setting neither {@link layerAttributions}
 * nor {@link staticAttributions} results in an empty window.
 */
export interface AttributionsPluginOptions extends PluginOptions {
	/**
	 * Optional icon override.
	 */
	icons?: AttributionIcons

	/**
	 * Whether the information box is open by default.
	 * Only usable when {@link renderType} is set to `'independent'` and {@link layout | MapConfiguration.layout}
	 * is set to `'nineRegions'` OR {@link layout | MapConfiguration.layout} is set to `'standard'`.
	 * Otherwise, the IconMenu or the Footer handles this.
	 */
	initiallyOpen?: boolean

	/**
	 * List of attributions that are shown when the matching layer is visible.
	 */
	layerAttributions?: Attribution[]

	/**
	 * Store references to listen to for changes.
	 * Will update the currently visible layers depending on the current map state on changes to these values.
	 */
	listenToChanges?: StoreReference[]

	/**
	 * Defines whether this plugin (`'independent'`) or the IconMenu (`'iconMenu'`)
	 * should handle opening the information box or if a small information box
	 * should always be visible (`'footer'`).
	 *
	 * @remarks
	 * Only relevant if {@link layout | MapConfiguration.layout} is set to `'nineRegions'`,
	 * as it is otherwise expected to be rendered as part of the Footer.
	 *
	 * @defaultValue 'independent'
	 */
	renderType?: 'footer' | 'iconMenu' | 'independent'

	/**
	 * List of static attributions that are always shown. May contain HTML elements.
	 */
	staticAttributions?: string[]

	/**
	 * If {@link renderType} is set to `'independent'` and {@link layout | MapConfiguration.layout}
	 * is set to `'nineRegions'` OR {@link layout | MapConfiguration.layout} is set to `'standard'`,
	 * sets the width of the container of the attributions.
	 *
	 * @defaultValue 500
	 */
	windowWidth?: number
}

interface AttributionIcons {
	/**
	 * Icon shown when pressing the button closes the attributions.
	 *
	 * @defaultValue 'kern-icon--chevron-forward'
	 */
	close?: string

	/**
	 * Icon shown when pressing the button opens the attributions.
	 *
	 * @defaultValue 'kern-icon--copyright'
	 */
	open?: string
}
