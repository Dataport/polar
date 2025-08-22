import type { Feature } from 'ol'

export type MarkersIsSelectableFunction = (feature: Feature) => boolean

export interface CallOnMapSelect {
	action: string
	payload: unknown
	pluginName?: string
}

/**
 * A full documentation of the parameters is available at the Masterportal's https://www.masterportal.org/mkdocs/doc/Latest/User/Global-Config/style.json/.
 * For more details, visual examples, and expert features, see there.
 */
export interface PolygonFillHatch {
	pattern?:
		| 'diagonal'
		| 'diagonal-right'
		| 'zig-line'
		| 'zig-line-horizontal'
		| 'circle'
		| 'rectangle'
		| 'triangle'
		| 'diamond'
		| object
	size?: number
	lineWidth?: number
	backgroundColor?: [number, number, number, number]
	patternColor?: [number, number, number, number]
}

export interface MarkerStyle {
	/**
	 * `width` and `height` of the `<svg>`-cluster-marker.
	 *
	 * @defaultValue `[40, 36]`
	 */
	clusterSize: [number, number]

	/**
	 * Fill color (or hatch pattern) for map marker.
	 */
	fill: string | PolygonFillHatch

	/**
	 * `width` and `height` of the `<svg>`-marker.
	 *
	 * @defaultValue `[26, 36]`
	 */
	size: [number, number]

	/**
	 * Color of marker stroke (outer line).
	 *
	 * @defaultValue `'#FFFFFF'`
	 */
	stroke: string

	/**
	 * Width of marker stroke (outer line).
	 *
	 * @defaultValue `'2'`
	 */
	strokeWidth: string | number
}

export interface MarkerLayer {
	id: string
	defaultStyle: MarkerStyle
	hoverStyle: MarkerStyle
	selectionStyle: MarkerStyle
	unselectableStyle: MarkerStyle
	isSelectable: MarkersIsSelectableFunction
}

export interface MarkerLayerConfiguration {
	/** Unique identifier of a layer configured in {@link MapConfiguration.layers | `mapConfiguration.layers`}. */
	id: string

	/**
	 * Used as the default marker style.
	 * The default fill color for these markers is `'#005CA9'`.
	 */
	defaultStyle?: Partial<MarkerStyle>

	/**
	 * Used as map marker style for hovered features.
	 * The default fill color for these markers is `'#7B1045'`.
	 */
	hoverStyle?: Partial<MarkerStyle>

	/**
	 * Used as map marker style for selected features.
	 * The default fill color for these markers is `'#679100'`.
	 */
	selectionStyle?: Partial<MarkerStyle>

	/**
	 * Used as a map marker style for unselectable features.
	 * Features are unselectable if a given {@link MarkerLayerConfiguration.isSelectable | `isSelectable`} method returns
	 * falsy for a feature.
	 * The default fill color for these markers is `'#333333'`.
	 */
	unselectableStyle?: Partial<MarkerStyle>

	/**
	 * If undefined, all features are selectable.
	 * If defined, this can be used to sort out features to be unselectable,
	 * and such features will be styled differently and won't react on click.
	 *
	 * @example
	 * ```
	 * isSelectable: (feature: Feature) => feature.get('indicator')
	 * ```
	 */
	isSelectable?: MarkersIsSelectableFunction
}

export interface MarkerConfiguration {
	/**
	 * List of layers including optional style information and under which
	 * condition a feature is selectable.
	 */
	layers: MarkerLayerConfiguration[]

	/**
	 * If set, the given `action` will be called with the given `payload`. If the
	 * `pluginName` is set, the action will be called in the respective plugin,
	 * otherwise the core store is used.
	 *
	 * @example
	 * ```
	 * callOnMapSelect: {
	 *   action: 'openMenuById',
	 *   payload: 'gfi',
	 *   pluginName: 'iconMenu'
	 * }
	 * ```
	 *
	 * @remarks
	 * The example open the gfi window in the iconMenu, if the IconMenu exists
	 * with the gfi plugin registered under the id `gfi`.
	 */
	callOnMapSelect?: CallOnMapSelect

	/**
	 * If `true`, clicking a cluster feature will zoom into the clustered features'
	 * bounding box (with padding) so that the cluster is "resolved". This happens
	 * until the maximum zoom level is reached, at which no further zooming can
	 * take place. Defaults to `false`.
	 */
	clusterClickZoom?: boolean
}
