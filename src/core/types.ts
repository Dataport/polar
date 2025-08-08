import type { KernThemeOverride } from '@kern-ux-annex/webc'
import type { Resource } from 'i18next'
import { Feature } from 'ol'
import type { SetupStoreDefinition } from 'pinia'
import type { Component, VueElement } from 'vue'

/**
 * Copied from https://stackoverflow.com/a/54178819.#
 *
 * Makes the properties defined by type `K` optional in type `T`.
 *
 * Example: PartialBy\<LayerConfiguration, 'id' | 'name'\>
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export interface Locale {
	resources: Resource
	/** Language key as described in the i18next documentation */
	type: string
}

export interface PolarError {
	type: 'connection' | 'uncategorized'
	statusCode: number | null
	text: string
}

export interface ServiceAvailabilityCheck {
	ping: Promise<number>
	serviceId: string
	serviceName: string
}

// TODO(dopenguin): Adjust these options
export interface PluginOptions {
	displayComponent?: boolean
	layoutTag?: string // TODO: Might it be useful to move declaration of NineLayoutTag here?
}

export type PolarPluginStore = SetupStoreDefinition<
	string,
	{
		setupPlugin: () => void
		teardownPlugin: () => void
	}
>

export interface PluginContainer {
	/**
	 * Unique technical identifier.
	 *
	 * The recommended strategy for ensuring uniqueness is using the package name (including scope, if scoped) as a prefix.
	 *
	 * @example `@polar/polar/plugins/fullscreen`
	 */
	id: string

	/** A Vue component if required. */
	component?: Component

	/** Locales used in the plugin. */
	locales?: Locale[]

	/**
	 * Configuration options. Please also note that all configuration added via plugin constructors can be overridden in
	 * the {@link createMap | `createMap`'s parameter `mapConfiguration`} .
	 *
	 * You may use either object (or a mix of them) to create the configuration, e.g. use the constructors for a base
	 * configuration and the `mapConfiguration` object to override it for various use cases.
	 *
	 * How exactly you do this is up to you and influences the minimum API call requirements your client has.
	 */
	options?: PluginOptions

	/**
	 * Pinia store module if required. If the storeModule features a `setupPlugin` action, it will be executed
	 * automatically after initialization.
	 */
	storeModule?: PolarPluginStore
}

/**
 *
 * Map-Config
 *
 */

export type InitialLanguage = 'de' | 'en'

export type MarkersIsSelectableFunction = (feature: Feature) => boolean

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

export interface CallOnMapSelect {
	action: string
	payload: unknown
	pluginName?: string
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

export interface LayerConfigurationOptionLayers {
	/**
	 * Legend image to be used for sub-layer. If false, no image is displayed.
	 * If true, it is assumed an image exists in the layer's GetCapabilities, and
	 * that will be used. If Record, it maps the layer name to a linked image.
	 */
	legend?: boolean | Record<string, string>

	/**
	 * Comma-separated re-ordering of service layer's 'layer' specification.
	 * Layer's not specified in service definition, but in order, are initially
	 * invisible. Layers not specified in order, but in service definition, are
	 * always visible. Layers specified in both are initially visible. Layers
	 * specified in neither are always invisible.
	 */
	order?: string

	/**
	 * Title to be displayed for sub-layer. If false, layer name itself will
	 * be used as given in service description 'layers' field. If true, it is
	 * assumed a name exists in the layer's GetCapabilities, and that will be
	 * used. If Record, it maps the layer name to an arbitrary display name given
	 * by the configuration.
	 */
	title?: boolean | Record<string, string>
}

export type LayerType = 'background' | 'mask'

export interface LayerConfigurationOptions {
	/**
	 * Named matching OGC-specification of a WMS layer's layers.
	 */
	layers?: LayerConfigurationOptionLayers
	// NOT IMPLEMENTED
	// transparency: boolean
}

export interface LayerConfiguration {
	/**
	 * Unique id to identify the layer.
	 */
	id: string

	/**
	 * Human-readable identifier and value to be display in the UI.
	 */
	name: string

	/**
	 * Whether the layer is a background layer or a feature layer with specific information.
	 */
	type: LayerType

	/**
	 * layers may have their own gfiMode.
	 */
	gfiMode?: 'bboxDot' | 'intersects'

	/**
	 * Whether the mask-layer should be hidden from the LayerChooser selection menu.
	 */
	hideInMenu?: boolean

	/**
	 * The minimum zoom level the layer will be rendered in.
	 *
	 * @defaultValue 0
	 */
	minZoom?: number

	/**
	 * The maximum zoom level the layer will be rendered in.
	 *
	 * @defaultValue Number.MAX_SAFE_INTEGER
	 */
	maxZoom?: number

	/**
	 * Enables a configuration feature for the layer in its selection.
	 */
	options?: LayerConfigurationOptions

	/**
	 * ID of the used style. If the layer is also configured in {@link MapConfiguration.markers | `mapConfiguration.markers`},
	 * that configuration takes precedence over the configured `styleId`. Only applicable for vector-type layers.
	 * For more information and an example see {@link MapConfiguration.featureStyles | `mapConfiguration.featureStyles`}.
	 * Defaults and fallbacks to OpenLayers default styling.
	 */
	styleId?: string

	/**
	 * Whether the layer should be rendered
	 *
	 * @defaultValue false
	 */
	visibility?: boolean
}

export interface PolarMapOptions {
	/**
	 * Size of 1 pixel on the screen converted to map units (e.g. meters) depending on the used projection
	 * ({@link MasterportalApiConfiguration.epsg} | `epsg`).
	 */
	resolution: number

	/**
	 * Scale in meters.
	 */
	scale: number

	/**
	 * Zoom level.
	 */
	zoomLevel: number
}

export interface OklchColor {
	l: string
	c: string
	h: string
}

/**
 * A theme for the POLAR map client.
 */
export interface PolarTheme {
	/**
	 * This color will be defined as `--brand-color-{l,c,h}` CSS variable inside POLAR's shadow DOM.
	 * It can especially be used to define the KERN theme via {@link https://developer.mozilla.org/de/docs/Web/CSS/color_value/oklch | oklch}.
	 */
	brandColor?: OklchColor

	/**
	 * Theme for KERN UX library as defined by {@link https://www.npmjs.com/package/@kern-ux-annex/webc | `@kern-ux-annex/webc`}.
	 */
	kern?: KernThemeOverride
}

/**
 * The `<...masterportalapi.fields>` means that any \@masterportal/masterportalapi field may also be used here _directly_
 * in the {@link MapConfiguration | `mapConfiguration`}. The fields described here are fields that are interesting for
 * the usage of POLAR.
 * Fields that are not set as required have default values.
 */
export interface MasterportalApiConfiguration {
	/**
	 * Initial center coordinate.
	 * Coordinate needs to be defined in the chosen leading coordinate system configured by
	 * {@link MasterportalApiConfiguration.epsg | `mapConfiguration.epsg`}.
	 *
	 * @example
	 * ```
	 * startCenter: [553655.72, 6004479.25]
	 * ```
	 */
	startCenter: [number, number]
	/**
	 * Leading coordinate system. The coordinate system has to be defined in
	 * {@link MasterportalApiConfiguration.namedProjections | `mapConfiguration.namedProjections`} as well.
	 * Changing this value should also lead to changes in
	 * {@link MasterportalApiConfiguration.startCenter | `mapConfiguration.startCenter`},
	 * {@link MasterportalApiConfiguration.extent | `mapConfiguration.extent`},
	 * {@link MasterportalApiConfiguration.options | `mapConfiguration.options`} and
	 * {@link MasterportalApiConfiguration.startResolution | `mapConfiguration.startResolution`} as they are described in
	 * or are related to the leading coordinate system.
	 *
	 * @defaultValue `'EPSG:25832'`
	 *
	 * @example
	 * ```
	 * epsg: 'EPSG:4326'
	 * ```
	 */
	epsg?: `EPSG:${string}`
	/**
	 * Map movement will be restricted to the rectangle described by the given coordinates. Unrestricted by default.
	 * Coordinates need to be defined in the chosen leading coordinate system configured by
	 * {@link MasterportalApiConfiguration.epsg | `mapConfiguration.epsg`}.
	 *
	 * @example
	 * ```
	 * extent: [426205.6233, 5913461.9593, 650128.6567, 6101486.8776]
	 * ```
	 */
	extent?: [number, number, number, number]
	/**
	 * Array of usable coordinated systems mapped to a projection as a proj4 string. Defines `'EPSG:25832'`, `'EPSG:3857'`,
	 * `'EPSG:4326'`, `'EPSG:31467'` and `'EPSG:4647'` by default. If you set a value, please mind that all pre-configured
	 * projections are overridden, and requiring e.g. `'EPSG:4326'` will only work if it is also defined in your override.
	 *
	 * @example
	 * ```
	 * namedProjections: [
	 * 	[
	 * 		'EPSG:25832',
	 *		'+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
	 * 	],
	 * ]
	 * ```
	 */
	namedProjections?: Array<[string, string]>
	/**
	 * Defines all available zoom levels mapped to the respective resolution and related scale.
	 * The resolution is dependent on the chosen leading coordinate system configured by
	 * {@link MasterportalApiConfiguration.epsg | `mapConfiguration.epsg`}.
	 * Defines 10 zoomLevels for `'EPSG:25832'` by default.
	 *
	 * @example
	 * ```
	 * options: [
	 * 	{ resolution: 66.14579761460263, scale: 250000, zoomLevel: 0 },
	 * 	{ resolution: 26.458319045841044, scale: 100000, zoomLevel: 1 },
	 * 	{ resolution: 15.874991427504629, scale: 60000, zoomLevel: 2 },
	 * 	{ resolution: 10.583327618336419, scale: 40000, zoomLevel: 3 },
	 * 	{ resolution: 5.2916638091682096, scale: 20000, zoomLevel: 4 },
	 * 	{ resolution: 2.6458319045841048, scale: 10000, zoomLevel: 5 },
	 * 	{ resolution: 1.3229159522920524, scale: 5000, zoomLevel: 6 },
	 * 	{ resolution: 0.6614579761460262, scale: 2500, zoomLevel: 7 },
	 * 	{ resolution: 0.2645831904584105, scale: 1000, zoomLevel: 8 },
	 * 	{ resolution: 0.1322915952292052, scale: 500, zoomLevel: 9 },
	 * ]
	 * ```
	 */
	options?: PolarMapOptions[]
	/**
	 * Initial resolution; must be described in {@link MasterportalApiConfiguration.options | `mapConfiguration.options`}.
	 * Defaults to `15.874991427504629` which is a zoom level defined in the default configuration of
	 * {@link MasterportalApiConfiguration.options | `mapConfiguration.options`}.
	 *
	 * @defaultValue `15.874991427504629`
	 * @example
	 * ```
	 * startResolution: 264.583190458
	 * ```
	 */
	startResolution?: number
}

/** The mapConfiguration allows controlling many client instance details. */
export interface MapConfiguration extends MasterportalApiConfiguration {
	/**
	 * Configuration of layers that are supposed to be used in the respective client. All layers defined here have to have
	 * an entry in the {@link createMap | `serviceRegister` parameter of `createMap`}. If `@polar/plugin-layer-chooser` is
	 * installed and configured, all these layers will be displayed in that menu.
	 *
	 * @example
	 * ```
	 * layers: [
	 * 	{
	 * 		id: 'basemap',
	 * 		name: 'Basemap Grayscale',
	 * 	},
	 * 	{
	 * 		id: 'my-wfs',
	 * 		name: 'My WFS service',
	 * 	},
	 * ]
	 * ```
	 */
	layers: LayerConfiguration[]
	/** If set to `true`, all services' availability will be checked with head requests. */
	checkServiceAvailability?: boolean
	/**
	 * Optional path to define styles for vector features. The parameter may be a url or a path on the local file system.
	 * See `mapConfiguration.featureStyles` for more information.
	 */
	featureStyles?: string

	/**
	 * The initial language the client should be using.
	 *
	 * @defaultValue `'de'` (German)
	 */
	language?: InitialLanguage

	/**
	 * Choose between the standard sidebar layout with fixed positioning, the oldschool nine region layout with full
	 * configurability regarding positioning or add a custom layout as Vue component.
	 */
	layout?: 'standard' | 'nineRegions' | VueElement
	/**
	 * All locales in POLAR and its plugins can be overridden to fit your needs.
	 * Take a look at the respective documentation for all values that can be overridden.
	 *
	 * A language option is an object consisting of a type (its language key) and the i18next resource definition.
	 * You may e.g. decide that the texts offered in the LayerChooser do not fit the style of your client, or that they
	 * could be more precise in your situation since you're only using *very specific* overlays.
	 *
	 * @example
	 * ```
	 * locales: [
	 * 	{
	 * 		type: 'de',
	 * 		resources: {
	 * 			plugins: {
	 * 				layerChooser: {
	 * 					maskTitle: 'Bahnstrecken',
	 * 				},
	 * 			},
	 * 		},
	 * 	},
	 * 	{
	 * 		type: 'en',
	 * 		resources: {
	 * 			plugins: {
	 * 				layerChooser: {
	 * 					maskTitle: 'Railway lines',
	 * 				},
	 * 			},
	 * 		},
	 * 	},
	 * ],
	 * ```
	 *
	 * @remarks
	 * When reading the locale tables, please mind that the dot notation (`a.b.c | value`) has to be written as separate
	 * keys in nested objects as seen in the example above (`{a: {b: {c: "value"}}}`).
	 */
	locales?: Locale[]
	/**
	 * If set, all configured visible vector layers' features can be hovered and selected by mouseover and click respectively.
	 * They are available as features in the store. Layers with `clusterDistance` will be clustered to a multi-marker
	 * that supports the same features. Please mind that only point marker vector layers are supported.
	 * For all other layers, take a look at the configuration of
	 * {@link MapConfiguration.featureStyles | `mapConfiguration.featureStyles`}.
	 * Note, that this configuration parameter takes precedence over the configuration of
	 * {@link MapConfiguration.featureStyles | `mapConfiguration.featureStyles`}.
	 */
	markers?: MarkerConfiguration
	/**
	 * If a secured layer is supposed to be visible on start, the token also has to be provided via this configuration parameter.
	 * Updates to the token have to be done by updating the store parameter `oidcToken`.
	 */
	oidcToken?: string
	/**
	 * Regular expression defining URLs that belong to secured services. All requests sent to URLs that fit the regular
	 * expression will send the JSON Web Token (JWT) found in the store parameter `oidcToken` as a Bearer token in the
	 * Authorization header of the request. Requests already including an Authorization header will keep the already present one.
	 */
	secureServiceUrlRegex?: string

	/**
	 * Custom theme for POLAR.
	 *
	 * The default is to use KERN's standard theme.
	 */
	theme?: PolarTheme
}
