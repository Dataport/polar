import type { Feature } from 'ol'
import type { Style } from 'ol/style'

export type MarkersIsSelectableFunction = (feature: Feature) => boolean
export type GetMarkerFunction = (
	style: MarkerStyle,
	count: number,
	displayFeatureCount: boolean
) => Style
export type GetSVGConfigFunction = (digits: string) => MarkerSVGConfig
export type GetTextPositionFunction = (path: string) => TextPosition
export type PinShape = 'circle' | 'pill'
export interface TextPosition {
	x: number
	y: number
}
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
	backgroundColor?: [number, number, number, number]
	lineWidth?: number
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
	patternColor?: [number, number, number, number]
	size?: number
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

	/**
	 * Text to display on the marker..
	 *
	 * @defaultValue `''`
	 */
	displayedText?: string | number
}

export interface MarkerSVGConfig {
	/**
	 * The SVG path for the markershape where the text is displayed in.
	 */
	contentPath: string

	/**
	 * The definitions for the marker (e.g. shadow patterns with image data).
	 */
	defs: string

	/**
	 * Calculates the x and y coordinates for the text position within the marker.
	 * The calculation is based on the provided SVG path
	 * @throws  Error If the provided path does not match the expected marker pattern.
	 * @returns The x and y coordinates for the text position within the marker.
	 */
	getTextPosition: GetTextPositionFunction

	/**
	 * The shape of the marker
	 */
	pinShape: PinShape

	/**
	 * The shadow path for the main/front marker layer.
	 */
	shadowPath: string

	/** The outer shape of the marker. */
	shapePath: string

	/**
	 * The SVG shadow paths for the stacked marker layers.
	 */
	stackedShadow1: string
	stackedShadow2: string

	/**
	 * The SVG paths for the stacked markershape.
	 */
	stackedShape1: string
	stackedShape2: string
	stackedTip1: string
	stackedTip2: string

	readonly textPosition: TextPosition

	/**
	 * The SVG path for the tip of the marker.
	 */
	tipPath: string

	/**
	 * The viewBox for the marker.
	 */
	viewBox: string
}

export interface MarkerLayer {
	defaultStyle: MarkerStyle
	hoverStyle: MarkerStyle
	id: string
	isSelectable: MarkersIsSelectableFunction
	selectionStyle: MarkerStyle
	unselectableStyle: MarkerStyle
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

	/**
	 * If `true`, the number of features in a cluster will be displayed on the cluster marker.
	 * @defaultValue `false`
	 */
	displayFeatureCount?: boolean
}
