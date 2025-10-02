import type { Color, PluginId as PolarPluginId, PluginOptions } from '@/core'

/** Plugin identifier. */
export const PluginId = 'pins'

export type PinMovable = 'drag' | 'click' | 'none'

/** Plugin options for pins plugin. */
export interface PinsPluginOptions extends PluginOptions {
	/**
	 * Whether the pins should be restricted to an area defined by a layer.
	 *
	 * When pins are moved or created outside the boundary, an information will be
	 * shown and the pin is reset to its previous state. The map will wait at most
	 * 10s for the layer to load; should it not happen, the boundary feature is
	 * turned off.
	 *
	 * @example
	 * ```
	 * {
	 *   layerId: 'hamburgBorder',
	 * }
	 * ```
	 */
	boundary?: PinBoundary
	/**
	 * The pins plugin may react to changes in other plugins.
	 * This parameter specifies the path to such store positions.
	 *
	 * The position must, when subscribed to, return a GeoJSON feature.
	 *
	 * Please mind that, when referencing another plugin, that plugin must be
	 * added through `addPlugin` before this plugin for the connection to work.
	 *
	 * @example
	 * ```
	 * {
	 *   pluginName: 'addressSearch',
	 *   getterName: 'chosenAddress'
	 * }
	 * ```
	 */
	coordinateSource?: { pluginName: PolarPluginId; getterName: string }
	/**
	 * Configuration options for setting an initial pin.
	 *
	 * @example
	 * ```
	 * {
	 *   coordinates: [611694.909470, 5975658.233007],
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

export interface PinBoundary {
	/**
	 * ID of the vector layer to restrict pins to.
	 */
	layerId: string
	/**
	 * If the boundary layer check does not work due to loading or configuration
	 * errors, style `'strict'` will disable the pins feature, and style
	 * `'permissive'` will act as if no boundaryLayerId was set.
	 *
	 *@defaultValue 'permissive'
	 */
	onError?: 'strict' | 'permissive'
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
