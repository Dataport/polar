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
	component: Component
	name: string
	options: PluginOptions
	locales?: Locale[]
	storeModule?: PolarPluginStore
}

/**
 *
 * Map-Config
 *
 */

/** The initial language the client should be using; defaults to 'de' if not given */
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
	/** Unique id to identify the layer */
	id: string
	/** Human readable identifier */
	name: string
	/** Whether the layer is a background layer or a feature layer with specific information */
	type: LayerType
	/** layers may have their own gfiMode */
	gfiMode?: 'bboxDot' | 'intersects'
	/** Whether the mask-layer should be hidden from the LayerChooser selection menu */
	hideInMenu?: boolean
	/** The minimum zoom level the layer will be rendered in; defaults to 0 */
	minZoom?: number
	/** The maximum zoom level the layer will be rendered in; defaults to Number.MAX_SAFE_INTEGER */
	maxZoom?: number
	/** Enables a configuration feature for the layer in its selection. */
	options?: LayerConfigurationOptions
	styleId?: string
	/** Whether the layer should be rendered; defaults to false */
	visibility?: boolean
}

export interface PolarMapOptions {
	resolution: number
	scale: number
	zoomLevel: number
}

export interface MasterportalApiConfiguration {
	/** Initial center coordinate for the mapView */
	startCenter: [number, number]
	/** The epsg code of the projection that the map will use */
	epsg?: `EPSG:${string}`
	/** Extent in which the map can be viewed in; coordinates are written in the set projection of the map set through this config. */
	extent?: [number, number, number, number]
	/** Enabled projections for the map; 2nd dimension of the array contains the epsg code as the first parameter and the proj4 definition as the second */
	namedProjections?: Array<[string, string]>
	/** Mapped resolution to zoomLevel */
	options?: PolarMapOptions[]
	/** Initial resolution the map should be rendered with */
	startResolution?: number
}

export interface MapConfiguration extends MasterportalApiConfiguration {
	/** Configured layers */
	layers: LayerConfiguration[]
	featureStyles?: string
	language?: InitialLanguage
	locales?: Locale[]
	markers?: MarkerConfiguration
	oidcToken?: string
	secureServiceUrlRegex?: string
}
