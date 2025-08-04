import type { KernTheme } from '@kern-ux-annex/webc'
import type { Resource } from 'i18next'
import { Feature } from 'ol'
import type {
	_ActionsTree,
	_GettersTree,
	StateTree,
	StoreDefinition,
} from 'pinia'
import type { Component } from 'vue'

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

type PolarPluginStore = StoreDefinition<
	string,
	StateTree,
	_GettersTree<StateTree>,
	_ActionsTree & { setupPlugin: () => void }
>

export interface PluginContainer {
	/** Unique technical identifier. */
	id: string
	/** A Vue component if required. */
	component?: Component
	/** Locales used in the plugin. */
	locales?: Locale[]
	/**
	 * Configuration options. Please also note that all configuration added via plugin constructors can be overridden in
	 * the `createMap`'s parameter `mapConfiguration`.
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

interface PolygonFillHatch {
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
	clusterSize: [number, number]
	fill: string | PolygonFillHatch
	size: [number, number]
	strokeWidth: string | number
	stroke: string
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

interface MarkerLayerConfiguration {
	id: string
	defaultStyle?: Partial<MarkerStyle>
	hoverStyle?: Partial<MarkerStyle>
	selectionStyle?: Partial<MarkerStyle>
	unselectableStyle?: Partial<MarkerStyle>
	isSelectable?: MarkersIsSelectableFunction
}

export interface MarkerConfiguration {
	layers: MarkerLayerConfiguration[]
	callOnMapSelect?: CallOnMapSelect
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
	/** Unique id to identify the layer. */
	id: string
	/** Human-readable identifier and value to be display in the UI. */
	name: string
	/** Whether the layer is a background layer or a feature layer with specific information. */
	type: LayerType
	/** layers may have their own gfiMode. */
	gfiMode?: 'bboxDot' | 'intersects'
	/** Whether the mask-layer should be hidden from the LayerChooser selection menu. */
	hideInMenu?: boolean
	/** The minimum zoom level the layer will be rendered in; defaults to 0. */
	minZoom?: number
	/** The maximum zoom level the layer will be rendered in; defaults to Number.MAX_SAFE_INTEGER. */
	maxZoom?: number
	/** Enables a configuration feature for the layer in its selection. */
	options?: LayerConfigurationOptions
	/**
	 * ID of the used style. If the layer is also configured in `mapConfiguration.markers`, that configuration takes
	 * precedence over the configured `styleId`. Only applicable for vector-type layers. For more information and an
	 * example see `mapConfiguration.featureStyles`. Defaults and fallbacks to OpenLayers default styling.
	 */
	styleId?: string
	/** Whether the layer should be rendered; defaults to false */
	visibility?: boolean
}

export interface PolarMapOptions {
	/** Size of 1 pixel on the screen converted to map units (e.g. meters) depending on the used projection (`epsg`). */
	resolution: number
	/** Scale in meters. */
	scale: number
	/** Zoom level. */
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
	 * It can especially be used to define the KERN theme via OKLCH.
	 */
	brandColor?: OklchColor

	/**
	 * Theme for KERN UX library as defined by `@kern-ux-annex/webc`.
	 */
	kern?: KernTheme
}

/**
 * The `<...masterportalapi.fields>` means that any \@masterportal/masterportalapi field may also be used here _directly_
 * in the mapConfiguration. The fields described here are fields that are interesting for the usage of POLAR.
 * Fields that are not set as required have default values.
 */
export interface MasterportalApiConfiguration {
	/**
	 * Initial center coordinate.
	 * Coordinate needs to be defined in the chosen leading coordinate system configured by `mapConfiguration.epsg`.
	 */
	startCenter: [number, number]
	/**
	 * Leading coordinate system. The coordinate system has to be defined in `mapConfiguration.namedProjections` as well.
	 * Changing this value should also lead to changes in `mapConfiguration.startCenter`, `mapConfiguration.extent`,
	 * `mapConfiguration.options` and `mapConfiguration.startResolution` as they are described in or are related to the
	 * leading coordinate system. Defaults to `'EPSG:25832'`.
	 */
	epsg?: `EPSG:${string}`
	/**
	 * Map movement will be restricted to the rectangle described by the given coordinates. Unrestricted by default.
	 * Coordinates need to be defined in the chosen leading coordinate system configured by `mapConfiguration.epsg`.
	 */
	extent?: [number, number, number, number]
	/**
	 * Array of usable coordinated systems mapped to a projection as a proj4 string. Defines `'EPSG:25832'`, `'EPSG:3857'`,
	 * `'EPSG:4326'`, `'EPSG:31467'` and `'EPSG:4647'` by default. If you set a value, please mind that all pre-configured
	 * projections are overridden, and requiring e.g. `'EPSG:4326'` will only work if it is also defined in your override.
	 */
	namedProjections?: Array<[string, string]>
	/**
	 * Defines all available zoom levels mapped to the respective resolution and related scale.
	 * The resolution is dependent on the chosen leading coordinate system configured by `mapConfiguration.epsg`.
	 * Defines 10 zoomLevels for `'EPSG:25832'` by default.
	 */
	options?: PolarMapOptions[]
	/**
	 * Initial resolution; must be described in `mapConfiguration.options`.
	 * Defaults to `15.874991427504629` which is a zoom level defined in the default configuration of `mapConfiguration.options`.
	 */
	startResolution?: number
}

/** The mapConfiguration allows controlling many client instance details. */
export interface MapConfiguration extends MasterportalApiConfiguration {
	/**
	 * Configuration of layers that are supposed to be used in the respective client. All layers defined here have to have
	 * an entry in the `serviceRegister` parameter of `createMap`. If `@polar/plugin-layer-chooser` is installed and configured,
	 * all these layers will be displayed in that menu. */
	layers: LayerConfiguration[]
	/** If set to `true`, all services' availability will be checked with head requests. */
	checkServiceAvailability?: boolean
	/**
	 * Optional path to define styles for vector features. The parameter may be a url or a path on the local file system.
	 * See `mapConfiguration.featureStyles` for more information.
	 */
	featureStyles?: string
	/** The initial language the client should be using; defaults to 'de' if not given. */
	language?: InitialLanguage
	/**
	 * All locales in POLAR and its plugins can be overridden to fit your needs.
	 * Take a look at the respective documentation for all values that can be overridden.
	 *
	 * A language option is an object consisting of a type (its language key) and the i18next resource definition.
	 * You may e.g. decide that the texts offered in the LayerChooser do not fit the style of your client, or that they
	 * could be more precise in your situation since you're only using *very specific* overlays.
	 */
	locales?: Locale[]
	/**
	 * If set, all configured visible vector layers' features can be hovered and selected by mouseover and click respectively.
	 * They are available as features in the store. Layers with `clusterDistance` will be clustered to a multi-marker
	 * that supports the same features. Please mind that only point marker vector layers are supported.
	 * For all other layers, take a look at the configuration of `mapConfiguration.featureStyles`.
	 * Note, that this configuration parameter takes precedence over the configuration of `mapConfiguration.featureStyles`.
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
