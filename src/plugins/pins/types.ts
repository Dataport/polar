import type { Color, LayerBoundPluginOptions, StoreReference } from '@/core'

/** Plugin identifier. */
export const PluginId = 'pins'

export type PinMovable = 'drag' | 'click' | 'none'

/** Plugin options for pins plugin. */
export interface PinsPluginOptions extends LayerBoundPluginOptions {
	/**
	 * The pins plugin may react to changes in other plugins.
	 * This parameter specifies the paths to such store positions.
	 *
	 * The position must, when subscribed to, return a GeoJSON feature.
	 *
	 * Please mind that, when referencing another plugin, that plugin must be
	 * added through `addPlugin` before this plugin for the connection to work.
	 *
	 * @example
	 * ```
	 * [{
	 *   plugin: 'addressSearch',
	 *   key: 'chosenAddress'
	 * }]
	 * ```
	 */
	coordinateSources?: StoreReference[]

	/**
	 * Configuration options for setting an initial pin.
	 *
	 * @example
	 * ```
	 * {
	 *   coordinate: [611694.909470, 5975658.233007],
	 *   centerOn: true,
	 *   epsg: 'EPSG:25832'
	 * }
	 * ```
	 */
	initial?: InitialPin

	/**
	 * Minimum zoom level for sensible marking.
	 *
	 * @defaultValue 0
	 */
	minZoomLevel?: number

	/**
	 * Whether a user may drag and re-click the pin (`'drag'`), only re-click it
	 * (`'click'`) or may only be placed programmatically (`'none'`).
	 *
	 * @defaultValue 'none'
	 */
	movable?: PinMovable

	/** Display style configuration. */
	style?: PinStyle

	/**
	 * Zoom level to use on outside input by e.g. address search.
	 *
	 * @defaultValue 0
	 */
	toZoomLevel?: number
}

// TODO(dopenguin): Expand this to also be able to change the SVG
export interface PinStyle {
	/**
	 * Fill color of the pin.
	 *
	 * @defaultValue '#005CA9'
	 */
	fill?: Color

	/**
	 * Stroke (that is, border) color of the pin.
	 *
	 * @defaultValue '#FFF'
	 */
	stroke?: Color

	/**
	 * Custom SVG icon for the pin icon.
	 */
	svg?: string
}

interface InitialPin {
	/** Coordinate pair for the pin. */
	coordinate: number[]

	/**
	 * If set to true, center on and zoom to the given coordinates on start
	 *
	 * @defaultValue false
	 */
	centerOn?: boolean

	/**
	 * Coordinate reference system in which the given coordinates are encoded.
	 *
	 * Defaults to {@link MapConfiguration.epsg | `mapConfiguration.epsg`}.
	 */
	epsg?: string
}
