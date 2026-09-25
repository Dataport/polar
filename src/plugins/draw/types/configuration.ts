import type { Options as TextOptions } from 'ol/style/Text'
import type { PluginOptions } from '@/core'
import type { DrawMode, DrawTextStyle } from './common'

/**
 * Lasso definition to describe which layers to copy geometries from.
 */
export interface DrawPluginOptionsLayerLasso {
	/**
	 * ID of the layer to lasso from. The layer must be a vector layer from the
	 * service register.
	 */
	id: string

	/**
	 * If given, the lasso will only be active when minimally this zoom level is
	 * used. This is to prevent overly copying geometries from layers with many
	 * geometries that may not load on the current zoom level.
	 * @defaultValue `undefined`
	 */
	minZoom?: number
}

export type DrawPluginOptionsMetaServiceAggregationMode = 'unequal' | 'all'

/**
 * From all geometries of the service intersecting our geometries, properties are aggregated.
 */
export interface DrawPluginOptionsMetaService {
	/**
	 * Id of the vector layer to make use of in the meta service.
	 */
	id: string

	/**
	 * Defaults to `'unequal'`. In mode `'unequal'`, one of each property set is kept; duplicate property sets are dropped. In mode `'all'`, all property sets are kept without further filtering.
	 */
	aggregationMode?: DrawPluginOptionsMetaServiceAggregationMode

	/**
	 * Names of the properties to build aggregations from. If left undefined, all found properties will be used.
	 */
	propertyNames?: string[]
}

/**
 * Controls a revision step that will produce a secondary output to the plugin, `revisedFeatureCollection`.
 */
export interface DrawPluginOptionsLayerRevision {
	/**
	 * If `true`, an automatic attempt at repairing the given geometries is executed regarding fulfillment of the OGC Simple Feature Specification (part of [SFA](https://www.ogc.org/de/publications/standard/sfa/)). Defaults to `false`.
	 */
	autofix?: boolean

	/**
	 * If `true`, geometries will be merged into MultiGeometries where applicable.
	 * Defaults to `false`.
	 */
	mergeToMultiGeometries?: boolean

	/**
	 * Specification of meta services that are requested with the spatial position of each geometry.
	 */
	metaServices?: DrawPluginOptionsMetaService[]

	/**
	 * If `true`, a `sfaValidity` flag is added to each feature's attributes that indicates whether the geometry is valid respective the OGC Simple Feature Specification (part of [SFA](https://www.ogc.org/de/publications/standard/sfa/)). This will override any other `sfaValidity` property. Defaults to `false`.
	 */
	validate?: boolean
}

/**
 * TODO: document (This is a magic object like in @polar/client-style-preview. Currently missing docs, this should probably somehow reference OpenLayers since it heavily borrows from there.)
 * TODO: document defaultValue
 *
 * Example:
 * ```
 * {
 *    fill: {
 *      color: 'rgba(255, 255, 255, 0.5)'
 *    },
 *    stroke: {
 *      color: '#e51313',
 *      width: 2
 *    },
 *    circle: {
 *      radius: 7,
 *      fillColor: '#e51313'
 *    },
 *  }
 * ```
 */
export interface DrawPluginOptionsLayerStyle {
	[key: string]: unknown
}

/**
 * Specification of a layer to work on in the draw plugin.
 */
export interface DrawPluginOptionsLayer {
	/**
	 * ID of the layer to work on.
	 * If this ID is contained in the services register, that layer must be
	 * a vector layer, and its features will be worked on.
	 * If this ID is not contained in the services register, a new vector layer
	 * with this ID will be created.
	 * If no ID is given, an ID will be generated that fits the prior case.
	 * @defaultValue A custom ID will be created
	 */
	id?: string

	/**
	 * Lassos allow the user to copy geometries from other layers onto the
	 * currently chosen draw layer.
	 */
	lassos?: DrawPluginOptionsLayerLasso[]

	/**
	 * Styling for text of measurements.
	 * Supports everything described at https://openlayers.org/en/v9.2.4/apidoc/module-ol_style_Text-Text.html.
	 *
	 * @example
	 * ```js
	 * {
	 *		font: '16px sans-serif',
	 *		placement: 'line',
	 *		fill: new Fill({ color: 'black' }),
	 *		stroke: new Stroke({ color: 'black' }),
	 *		offsetY: -5
	 * }
	 * ```
	 */
	measureStyle?: TextOptions

	/**
	 * Display name for layer. This is only used when multiple draw layers exist,
	 * and is used to offer the user to choose between them.
	 * TODO: check if it's used
	 * @defaultValue Arbitrary name based on `id`
	 */
	name?: string

	/**
	 * TODO: document
	 */
	revision?: DrawPluginOptionsLayerRevision

	/**
	 * Allowed drawing modes.
	 * @defaultValue `['Point', 'LineString', 'Polygon']`
	 */
	selectableDrawModes?: DrawMode[]

	/**
	 * Which layers to snap to when drawing.
	 * Entries must be IDs of vector layers in the service register.
	 * Drawing layer will always snap to themselves.
	 * @defaultValue `[]`
	 */
	snapTo?: string[]

	/**
	 * Used as default style for all drawn geometries.
	 * TODO: document defaultValue
	 */
	style?: DrawPluginOptionsLayerStyle

	/**
	 * Determines font and font color for the text drawn.
	 * You may offer multiple options for text sizes.
	 * TODO: document defaultValue
	 */
	textStyle?: DrawTextStyle
}

/**
 * Plugin options for draw plugin.
 */
export interface DrawPluginOptions extends PluginOptions {
	/**
	 * TODO: determine default value, there's probably something basic to provide
	 * @defaultValue []
	 */
	layers: DrawPluginOptionsLayer[]

	/**
	 * Shows a loader during saving and loading.
	 * TODO: unused, either start using or remove
	 * @defaultValue true
	 */
	showLoader?: boolean

	/**
	 * Shows measure options for drawing lines and polygons.
	 * @defaultValue false
	 */
	showMeasure?: boolean

	/**
	 * Shows styling options for drawing geometries.
	 * @defaultValue false
	 */
	showStyling?: boolean

	/**
	 * Shows toast messages for effects.
	 * TODO: unused, either start using or remove
	 * @defaultValue true
	 */
	showToasts?: boolean
}
