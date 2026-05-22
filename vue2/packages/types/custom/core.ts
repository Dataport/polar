import { Feature, Map } from 'ol'
import { Options as Fill } from 'ol/style/Fill'
import { Options as Stroke } from 'ol/style/Stroke'
import { Feature as GeoJsonFeature } from 'geojson'
import { VueConstructor } from 'vue'

/**
 *
 * Plugin-Container
 *
 */

/** Configuration of GFI feature regarding a specific layer */
export interface GfiLayerConfiguration {
	/**
	 * Property of the features of a service having an url usable to trigger a
	 * download of features as a document.
	 */
	exportProperty?: string
	// filter method to apply on response features, only relevant for WMS services
	filterBy?: 'clickPosition'
	// format the response is known to come in (e.g. "GML"); only relevant for WMS services
	format?: 'GML' | 'GML2' | 'GML3' | 'GML32' | 'text'
	/**
	 * Whether the found features' geometry, if available, is to be shown on the
	 * map. It is simply printed to a helper layer.
	 */
	geometry?: boolean
	// name of field to use for geometry, if not default field
	geometryName?: string
	isSelectable?: GfiIsSelectableFunction
	maxFeatures?: number
	/**
	 * If window is true, the properties are either
	 * 1. filtered by whether their key is in a string[]
	 * 2. filtered by whether their key is in the given object's keys, and then
	 *    translated to the object's value for that key
	 * I.e., a feature \{ a: 0, b: 0, c: 0 \} with ['a', 'b'] will show key-value
	 * pairs 'a':0 and 'b':0, and the same feature with object \{a: 'A'\} will
	 * show key-value pair 'A':0, mind the uppercase A, which is the mapped key.
	 *
	 * This does not influence what information is available in the store,
	 * only the UI is affected by these filters/mappings.
	 */
	properties?: string[] | Record<string, string>
	showTooltip?: (feature: Feature, map: Map) => [string, string][]
	/**
	 * Whether the found features' properties are to be shown in the client's UI.
	 * They are displayed as a table, one feature at a time, and if multiple
	 * features are found, the user may step through all where the layer's window
	 * value is true.
	 */
	window?: boolean
}

/** Object containing information for highlighting a gfi result */
export interface HighlightStyle {
	fill: Fill
	stroke: Stroke
}

export type GfiIsSelectableFunction = (feature: GeoJsonFeature) => boolean

/** configurable function to gather additional info */
export type GfiAfterLoadFunction = (
	featureInformation: Record<string, GeoJsonFeature[]>,
	srsName: string // TODO: Might be interesting to overlap this with mapConfig.namedProjections for type safety in using only allowed epsg codes
) =>
	| Record<string, GeoJsonFeature[] | symbol>
	| Promise<Record<string, GeoJsonFeature[] | symbol>>

/** GFI Module Configuration */
export interface FeatureList {
	mode: 'visible' | 'loaded'
	bindWithCoreHoverSelect?: boolean
	pageLength?: number
	text?: (string | ((f: Feature) => string))[]
}

export interface GfiConfiguration extends PluginOptions {
	/**
	 * Source paths through store to listen to for changes; it is assumed values
	 * listened to are coordinates that can be used to request information from
	 * the specified layers.
	 */
	coordinateSources: string[]
	/**
	 * The layers to request feature information from. Both WMS and WFS layers are
	 * supported. Keys are layer IDs as specified in the services.json registry.
	 */
	layers: Record<string, GfiLayerConfiguration>
	activeLayerPath?: string
	afterLoadFunction?: GfiAfterLoadFunction
	boxSelect?: boolean
	/**
	 * If required the stroke and fill of the highlighted feature can be configured.
	 * Otherwise, a default style is applied.
	 */
	customHighlightStyle?: HighlightStyle
	directSelect?: boolean
	featureList?: FeatureList
	/**
	 * Optionally replace GfiContent component.
	 * Usable to completely redesign content of GFI window.
	 */
	gfiContentComponent?: VueConstructor
	/**
	 * Limits the viewable GFIs per layer by this number. The first n elements
	 * are chosen arbitrarily. Useful if you e.g. just want one result, or to
	 * limit an endless stream of returns to maybe 10 or so. Infinite by default.
	 */
	maxFeatures?: number
	mode?: 'bboxDot' | 'intersects'
	multiSelect?: 'box' | 'circle'
	renderType?: 'iconMenu' | 'independent'
}
