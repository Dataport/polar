import type { Feature as GeoJsonFeature } from 'geojson'
import type { Feature, Map } from 'ol'
import type BaseLayer from 'ol/layer/Base'
import type ImageLayer from 'ol/layer/Image'
import type TileLayer from 'ol/layer/Tile'
import type { ImageWMS, TileWMS } from 'ol/source'
import type { Options as Fill } from 'ol/style/Fill'
import type { Options as Stroke } from 'ol/style/Stroke'

import type { PluginOptions, StoreReference } from '@/core'

/**
 * Plugin identifier.
 */
export const PluginId = 'gfi'

export const gfiFailedSymbol = Symbol('POLAR gfi call failed')

/**
 * Gfi configuration for a layer.
 *
 * @example
 * ```ts
 * {
 * 	geometry: true,
 * 	window: true,
 * 	maxFeatures: 10,
 * 	geometryName: 'app:geometry',
 * 	exportProperty: 'Export',
 * 	properties: {
 * 		status: 'status',
 * 		type: 'type',
 * 	},
 * 	showTooltip: (feature: Feature): [string, string][] => [
 * 		['div', `Feature ID: ${feature.properties.id}`],
 * 		['span', `Coordinates: ${feature.geometry.coordinates.join(', ')}`],
 * 	],
 * 	isSelectable: (feature: Feature): boolean => Boolean(Math.random() < 0.5)
 * }
 * ```
 */
export interface GfiLayerConfiguration {
	/**
	 * Property of the features of a service having an url usable to trigger a download of features as a document.
	 */
	exportProperty?: string

	/**
	 * (WMS-only)
	 * Some WMS services may return features close to the clicked position.
	 * By setting the value `clickPosition`, only features that intersect the clicked position are shown to the user.
	 *
	 * @defaultValue Show all features
	 */
	filterBy?: 'clickPosition'

	/**
	 * (WMS-only)
	 * If the `infoFormat` is not set to `'application/geojson'`´, this can be configured to be the known file format of the response.
	 * If not given, the format is parsed from the response data.
	 */
	format?: 'GML' | 'GML2' | 'GML3' | 'GML32' | 'text'

	/**
	 * If `true`, feature geometry will be highlighted within the map.
	 *
	 * @defaultValue true
	 */
	geometry?: boolean

	/**
	 * Name of the geometry property if not the default field.
	 */
	geometryName?: string

	/**
	 * A function can be defined to allow filtering features to be either selectable (return `true`) or not.
	 * Unselectable features will be filtered out by the GFI plugin and have neither GFI display nor store presence, but may be visible in the map nonetheless, depending on your other configuration.
	 * Please also mind that usage in combination with `extendedMasterportalapiMarkers` requires further configuration of that feature for smooth UX.
	 *
	 * @param feature - Feature to check
	 * @returns `true` if the feature should be selectable, `false` otherwise
	 */
	isSelectable?: (feature: GeoJsonFeature) => boolean

	/**
	 * In case `window` is `true`, this will be used to determine which contents to show.
	 * The property names can be localized, regardless if this is set or all properties are shown.
	 *
	 * @defaultValue Display all properties
	 */
	properties?: string[]

	/**
	 * (WFS- and GeoJSON-only)
	 * If given, a tooltip will be shown with the values calculated for the feature.
	 * The first string is the HTML tag to render, the second its contents; contants may be locale keys.
	 *
	 * Please mind that tooltips will only be shown if a mouse is used or the hovering device could not be detected.
	 * Touch and pen interactions do not open tooltips since they will open the GFI window, rendering the gatherable information redundant.
	 *
	 * @defaultValue undefined
	 * @param feature - Feature to calculate the tooltip for
	 * @returns [HTML tag to render, content or locale key]
	 */
	showTooltip?: (feature: Feature) => [string, string][]

	/**
	 * If `true`, properties will be shown in the map client.
	 *
	 * @defaultValue false
	 */
	window?: boolean
}

/**
 * Custom highlight style configuration.
 *
 * @example
 * ```ts
 * {
 * 	stroke: {
 * 		color: '#FFFF00',
 * 		width: 3,
 * 	},
 * 	fill: {
 * 		color: 'rgb(255, 255, 255, 0.7)',
 * 	},
 * }
 * ```
 */
export interface CustomHighlightStyle {
	/**
	 * Object for defining the fill style.
	 * See [OpenLayers documentation](https://openlayers.org/en/latest/apidoc/module-ol_style_Fill-Fill.html) for full options.
	 */
	fill: Fill

	/**
	 * Object for defining the stroke style.
	 * See [OpenLayers documentation](https://openlayers.org/en/latest/apidoc/module-ol_style_Stroke-Stroke.html) for full options.
	 */
	stroke: Stroke
}

/**
 * Configuration for visible features in the feature information window.
 *
 * @example
 * ```ts
 * {
 * 	mode: 'visible',
 * 	bindWithCoreHoverSelect: true,
 * 	pageLength: 5,
 * 	text: ['Nature reserves', (feature) => `${feature.get('str')} ${feature.get('hsnr')}`],
 * }
 * ```
 */
export interface FeatureList {
	activeLayers: StoreReference

	/**
	 * Whether to show only features currently visible in the map view's bounding box or to display all loaded features.
	 * In the latter case, if you desire to display all features of a layer (seen or not), set its loading strategy to `'all'`.
	 * The loading strategy is a value in the OpenLayers vector source configuration; see [ol/loadingStrategy](https://openlayers.org/en/latest/apidoc/module-ol_loadingstrategy.html) for further details.
	 */
	mode: 'visible' | 'loaded'

	/**
	 * If `true`, the hover/select fields in the core's state will be listened to and interacted with.
	 * This will result in a bilateral hovering and selecting of features with the core.
	 *
	 * @defaultValue false
	 */
	bindWithCoreHoverSelect?: boolean

	/**
	 * A number \>0 that sets the limit to the feature list's length.
	 * If the length is surpassed, additional features can be reached by using the pagination that is generated in such a case.
	 * If not defined, the list can be of arbitrary length.
	 */
	pageLength?: number

	/**
	 * Object with one to three entries that will produce title, subtitle, and an additional subtitle for the list view.
	 * If string, the text item will simply be that feature's value for the denoted property.
	 * If function, it's assumed to match the function signature `(feature: Feature): string`, and the returned string will be used for the text item.
	 */
	text?: {
		title: ((feature: Feature) => string) | string
		subtitle?: ((feature: Feature) => string) | string
		subSubtitle?: ((feature: Feature) => string) | string
	}
}

/**
 * Plugin options for gfi plugin.
 *
 * @example
 * An example configuration for the plugin might look like this:
 * ```ts
 * {
 * 	mode: 'bboxDot',
 * 	afterLoadFunction,
 * 	layers: {
 * 		'layerId': {
 * 			geometry: true,
 * 			window: true,
 * 			maxFeatures: 10,
 * 			geometryName: 'app:geometry',
 * 			exportProperty: 'Export',
 * 		},
 * 	},
 * 	coordinateSources: [
 * 		{ plugin: 'pins', key: 'transformedCoordinate' },
 * 		{ plugin: 'pins', key: 'coordinatesAfterDrag' },
 * 	],
 * 	customHighlightStyle: {
 * 		stroke: {
 * 			color: '#FFFF00',
 * 			width: 3,
 * 		},
 * 		fill: {
 * 			color: 'rgb(255, 255, 255, 0.7)',
 * 		},
 * 	},
 * }
 *
 * function afterLoadFunction(featuresByLayerId: Record<string, GeoJsonFeature[]>): Record<string, GeoJsonFeature[]> {
 * 	const filteredFeaturesByLayerId: Record<string, GeoJsonFeature[]> = {};
 * 	for (const layerId in featuresByLayerId) {
 * 		if (featuresByLayerId.hasOwnProperty(layerId)) {
 * 			const features = featuresByLayerId[layerId];
 * 			filteredFeaturesByLayerId[layerId] = features.filter(feature => feature.properties.type === 'desiredType');
 * 		}
 * 	}
 * 	return filteredFeaturesByLayerId;
 * }
 * ```
 */
export interface GfiPluginOptions extends PluginOptions {
	/**
	 * Maps a string (must be a layer ID) to a behaviour configuration for that layer.
	 */
	layers: Record<string, GfiLayerConfiguration>

	/**
	 * This method can be used to extend, filter, or otherwise modify a GFI result.
	 *
	 * @param featuresByLayerId - List of features by layer ID
	 * @returns Extended, filtered, or otherwise modified result
	 */
	afterLoadFunction?: (
		featuresByLayerId: Record<string, GeoJsonFeature[]>
	) => Record<string, GeoJsonFeature[]>

	/**
	 * The plugin will react to these coordinate positions in the store.
	 * This allows it to react to e.g. the address search or the pins plugin.
	 * Please see the example configuration for the common use-cases.
	 * Please mind that, when referencing another plugin, that plugin must be in `addPlugins` before this one.
	 */
	coordinateSources?: StoreReference[]

	/**
	 * If required, a user can change the stroke and fill of the highlighted feature.
	 * The default style as seen in the example will be used for each part that is not customized.
	 * An empty object will return the complete default style while e.g. for an object without a configured fill the default fill will be applied.
	 */
	customHighlightStyle?: CustomHighlightStyle

	/**
	 * If `true`, a feature can be selected without defining a value in `gfi.coordinateSources`.
	 *
	 * It is also possible to add multiple features to the selection by using the modifier key (CTRL on Windows or Command on macOS).
	 * To delesect a feature, simply reclick it with the modifier key pressed.
	 * To create a new selection, click anywhere else without pressing the modifier key.
	 *
	 * Be careful when using this parameter together with some values set in `coordinateSources` as it may lead to unexpected results.
	 * The features need to be distinguishable by their properties for the functionality to properly work.
	 *
	 * Does not work together with `extendedMasterportalapiMarkers`.
	 *
	 * @defaultValue false
	 */
	directSelect?: boolean

	/**
	 * If defined, a list of available vector layer features is visible when no feature is selected.
	 * Only usable if `renderType` is set to `iconMenu` and `window` is set to `true` for at least one configured layer.
	 */
	featureList?: FeatureList

	/**
	 * Limits the viewable GFIs per layer by this number.
	 * The first n elements are chosen arbitrarily.
	 * Useful if you e.g. just want one result, or to limit an endless stream of returns to e.g. 10.
	 * Infinite by default.
	 *
	 * @example 10
	 */
	maxFeatures?: number

	/**
	 * Method of calculating which feature has been chosen by the user.
	 * `bboxDot` utilizes the `bbox`-url parameter using the clicked coordinate while `intersects` uses a `Filter` to calculate the intersected features.
	 * Layers can have their own `gfiMode` parameter which would override this global mode.
	 * To apply this, add the desired value to the parameter in the `mapConfiguration`.
	 *
	 * @defaultValue `'bboxDot'`
	 */
	mode?: 'bboxDot' | 'intersects'

	/**
	 * If configured, multiple features can be selected at once by using the modifier key (CTRL on Windows or Command on macOS) and dragging the mouse.
	 * Can only be used in Desktop environments.
	 *
	 * If set to `'box'`, the selection will be done in a box.
	 * If set to `'circle'`, the selection will be done in a circle.
	 *
	 * Similar to `directSelect`, features can be added and removed by selection / unselecting them.
	 * The features need to be distinguishable by their properties for the functionality to properly work.
	 * Does not work together with `extendedMasterportalapiMarkers` of `@polar/core`.
	 *
	 * @defaultValue Disabled by default
	 */
	multiSelect?: 'box' | 'circle'
}

/** parameter specification for request method */
export interface RequestGfiParameters {
	coordinateOrExtent: [number, number] | [number, number, number, number]
	layer: BaseLayer
	layerConfiguration: GfiLayerConfiguration

	/** rawLayerList entry, see https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/doc/services.json.md */
	layerSpecification: Record<string, unknown>

	map: Map

	/** defaults to bboxDot (get from minimal coordinate bbox) */
	mode?: 'bboxDot' | 'intersects'
}

export interface RequestGfiWmsParameters {
	coordinate: [number, number]
	layer: TileLayer<TileWMS> | ImageLayer<ImageWMS>
	layerConfiguration: RequestGfiParameters['layerConfiguration']
	layerSpecification: RequestGfiParameters['layerSpecification']
	map: RequestGfiParameters['map']
}
