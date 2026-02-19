import { Feature, Map } from 'ol'
import { Options as Fill } from 'ol/style/Fill'
import { Options as Stroke } from 'ol/style/Stroke'
import { type Options as TextOptions } from 'ol/style/Text'
import { Size } from 'ol/size'
import { Color } from 'ol/color'
import { ColorLike } from 'ol/colorlike'
import { UserVuetifyPreset } from 'vuetify/types/services/presets'
import {
	ActionPayload,
	Commit,
	Dispatch,
	MutationPayload,
	MutationTree,
	Plugin,
	SubscribeActionOptions,
	SubscribeOptions,
} from 'vuex'
import { Feature as GeoJsonFeature, FeatureCollection } from 'geojson'
import { VueConstructor, WatchOptions } from 'vue'
import { Coordinate } from 'ol/coordinate'

/**
 *
 * Plugin-Container
 *
 */

export type RenderType = 'iconMenu' | 'independent' | 'footer'

/** Possible search methods by type */
export type SearchType = 'bkg' | 'wfs' | 'mpapi' | string

/**
 * Additional queryParameters for the GET-Request;
 * for the specific parameters for each request,
 * please refer to the types in the plugin
 */
export interface QueryParameters {
	/** sets the maximum number of features to retrieve */
	maxFeatures?: number
}

export type SearchDisplayMode = 'mixed' | 'categorized'

/** Object containing information for a specific search method */
export interface SearchMethodConfiguration {
	type: SearchType
	url: string
	categoryId?: string
	groupId?: string
	hint?: string
	label?: string
	placeholder?: string
	queryParameters?: QueryParameters
}

export type SearchMethodFunction = (
	signal: AbortSignal,
	url: SearchMethodConfiguration['url'],
	inputValue: string,
	queryParameters: SearchMethodConfiguration['queryParameters']
) => Promise<FeatureCollection> | never

export interface SelectResultPayload {
	feature: GeoJsonFeature & { title: string }
	categoryId: number
}

export type SelectResultFunction<S, G> = (
	context: PolarActionContext<S, G>,
	payload: SelectResultPayload
) => void

/**
 * The suffix of the feature in the FeatureCollection;
 * obsolete with WFS\@3.0.0 as GeoJSON will be the standard response
 */
export type MemberSuffix = 'member' | 'featureMember'

export interface AddressSearchGroupProperties {
	label: string
	resultDisplayMode: SearchDisplayMode
	hint?: string
	limitResults?: number
	placeholder?: string
}

export interface AddressSearchCategoryProperties {
	/** display label for category */
	label: string
}

/** AddressSearch Module Configuration */
export interface AddressSearchConfiguration extends PluginOptions {
	// Configured search methods
	searchMethods: SearchMethodConfiguration[]
	// optional loading action name to start loading
	addLoading?: string
	// definition of categories referred to in searchMethods
	categoryProperties?: Record<string, AddressSearchCategoryProperties>
	component?: VueConstructor
	// optional additional search methods (client-side injections)
	customSearchMethods?: Record<string, SearchMethodFunction>
	/** NOTE regarding \<any, any\> – skipping further type chain upwards precision due to object optionality/clutter that would continue to MapConfig level; the inverted rabbit hole ends here; not using "unknown" since that errors in client configuration, not using "never" since that errors in AddressSearch plugin; this way, "any"thing goes */
	// optional selectResult overrides (client-side injections)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	customSelectResult?: Record<string, SelectResultFunction<any, any>>
	focusAfterSearch?: boolean
	// definition of groups referred to in searchMethods
	groupProperties?: Record<string, AddressSearchGroupProperties>
	// Minimal input length before the search starts
	minLength?: number
	// optional loading action name to end loading
	removeLoading?: string
	afterResultComponent?: VueConstructor
	// Time passed in milliseconds before another search is started
	waitMs?: number
}

export interface Attribution {
	id: string
	title: string
}

/** Attributions Module Configuration */
export interface AttributionsConfiguration extends PluginOptions {
	buttonComponent?: VueConstructor
	icons?: {
		open?: string
		close?: string
	}
	initiallyOpen?: boolean
	listenToChanges?: string[]
	layerAttributions?: Attribution[]
	renderType?: RenderType
	staticAttributions?: string[]
	windowWidth?: number
}

export interface PolarCircleStyle {
	fillColor?: Color | ColorLike
	radius: number
	strokeColor?: Color | ColorLike
	displacement?: number[]
	scale?: number | Size
	rotation?: number
}

export interface DrawStyle {
	fill: Fill
	stroke: Stroke
	circle: PolarCircleStyle
	measure?: TextOptions
}

export interface TextStyle {
	font: string | FontStyle
	textColor?: Color | ColorLike
}

export interface FontStyle {
	size: number[]
	family: string
}

export type DrawMode = 'Circle' | 'LineString' | 'Point' | 'Polygon' | 'Text'

export type MeasureMode = 'none' | 'metres' | 'kilometres' | 'hectares'

export interface MeasureOptions {
	metres?: boolean
	kilometres?: boolean
	hectares?: boolean
	initialOption?: MeasureMode
}

export interface Lasso {
	id: string
	minZoom: boolean
}

export interface DrawConfiguration extends Partial<PluginOptions> {
	addLoading?: string
	enableOptions?: boolean
	lassos?: Lasso[]
	measureOptions?: MeasureOptions
	removeLoading?: string
	revision?: DrawRevision
	selectableDrawModes?: DrawMode[]
	snapTo?: string[]
	style?: DrawStyle
	textStyle?: TextStyle
	toastAction?: string
}

export interface DrawRevision {
	autofix?: boolean
	metaServices?: DrawMetaService[]
	validate?: boolean
}

export interface DrawMetaService {
	id: string
	aggregationMode?: 'unequal' | 'all'
	propertyNames?: string[]
}

export interface ExportConfiguration extends PluginOptions {
	/**
	 * Whether the user should be able to download a file
	 * or the data should only be accessible through the store.
	 */
	download?: boolean
	/** Tool offers exporting current mapView as a jpg. */
	showJpg?: boolean
	/** Tool offers exporting current mapView as a pdf. */
	showPdf?: boolean
	/** Tool offers exporting current mapView as a png. */
	showPng?: boolean
}

export interface FilterConfigurationTimeOption {
	amounts: number[]
	unit?: 'days'
}

interface FilterConfigurationTime {
	targetProperty: string
	freeSelection?: {
		now?: 'until' | 'from'
		unit?: 'days'
	}
	last?: FilterConfigurationTimeOption[]
	next?: FilterConfigurationTimeOption[]
	pattern?: string
}

interface FilerConfigurationCategory {
	knownValues: (string | number)[]
	targetProperty: string
	selectAll?: boolean
}

export interface FilterConfiguration extends PluginOptions {
	layers: Record<
		string,
		{
			categories?: FilerConfigurationCategory[]
			time?: FilterConfigurationTime
		}
	>
}

export interface GeoLocationConfiguration extends LayerBoundPluginOptions {
	/**
	 * Source paths through store to listen to for changes; it is assumed values
	 * listened to are coordinates that can be used to request information from
	 * the specified layers.
	 */
	checkLocationInitially?: boolean
	/** whether to keep center on user or allow movement after first zoom to */
	keepCentered?: boolean
	renderType?: RenderType
	showTooltip?: boolean
	/**
	 * Limits the viewable GFIs per layer by this number. The first n elements
	 * are chosen arbitrarily. Useful if you e.g. just want one result, or to
	 * limit an endless stream of returns to maybe 10 or so. Infinite by default.
	 */
	zoomLevel?: number
}

/** Object containing information for highlighting a gfi result */
export interface HighlightStyle {
	fill: Fill
	stroke: Stroke
}

export interface FullscreenConfiguration extends PluginOptions {
	renderType?: RenderType
	targetContainerId?: string
}

export interface LayerChooserConfiguration extends PluginOptions {
	component?: VueConstructor
}

export interface LegendConfiguration extends PluginOptions {
	icons?: {
		open?: string
		close?: string
	}
}

export interface AppearOnClick {
	/** Whether the pin should be set with a click on a map. */
	show: boolean
	/** At which zoomLevel it should be possible to have a pin set (if show is set to true). */
	atZoomLevel?: number
}

interface InitialPin {
	coordinates: [number, number]
	centerOn?: boolean
	epsg?: string
}

type MovablePin = 'drag' | 'click' | 'none'

interface PinStyle {
	fill?: string
	stroke?: string
}

export interface PinsConfiguration extends LayerBoundPluginOptions {
	appearOnClick?: AppearOnClick
	/** Path in store from where coordinates can be retrieved from. */
	coordinateSource?: string
	initial?: InitialPin
	/** If the pin should be movable; defaults to false. */
	movable?: boolean | MovablePin
	/** Pin styling */
	style?: PinStyle
	/** The zoom level to zoom to when a pin is added to the map. */
	toZoomLevel?: number
}

export interface ReverseGeocoderConfiguration {
	// WPS (Web Processing Service) URL
	url: string
	// optional loading action name to start loading
	addLoading?: string
	// points to an address acceptor; on resolve, address is dispatched there
	addressTarget?: string
	// points to a coordinate source; on update, coordinate is resolved
	coordinateSource?: string
	// optional loading action name to end loading
	removeLoading?: string
	// optionally zooms to given coordinate after successful reverse geocoding; number indicates zoom level
	zoomTo?: number
}

/** Style of a toast */
export interface ToastStyle {
	/** Color of the toast. */
	color?: string
	/** optional icon class from available icon set */
	icon?: string
}

/** various kinds of toasts */
export type ToastType = 'success' | 'info' | 'warning' | 'error'

export type ToastTypeStyles = {
	[key in ToastType]?: ToastStyle
}

/** configuration for toast type styles */
export type ToastConfiguration = PluginOptions & ToastTypeStyles

export interface ScaleConfiguration extends PluginOptions {
	showScaleSwitcher?: boolean
	zoomMethod?: string
}

export interface PointerPositionProjection {
	code: `EPSG:${string}`
	decimals?: number
}

export interface PointerPositionConfiguration extends PluginOptions {
	projections?: PointerPositionProjection[]
}

export interface ZoomIcons {
	zoomIn: string
	zoomOut: string
}

export interface ZoomConfiguration extends PluginOptions {
	component?: VueConstructor
	icons?: ZoomIcons
	renderType?: RenderType
	showMobile?: boolean
	showZoomSlider?: boolean
}

/**
 *
 * Map-Config
 *
 */

export interface MapConfig extends MasterportalApiConfig {
	/** if true, all services' availability will be checked with head requests */
	renderFaToLightDom?: boolean
	stylePath?: string
	vuetify?: UserVuetifyPreset
	addressSearch?: AddressSearchConfiguration
	attributions?: AttributionsConfiguration
	draw?: DrawConfiguration
	export?: ExportConfiguration
	filter?: FilterConfiguration
	fullscreen?: FullscreenConfiguration
	geoLocation?: GeoLocationConfiguration
	layerChooser?: LayerChooserConfiguration
	legend?: LegendConfiguration
	pins?: PinsConfiguration
	pointerPosition?: PointerPositionConfiguration
	reverseGeocoder?: ReverseGeocoderConfiguration
	scale?: ScaleConfiguration
	toast?: ToastConfiguration
	zoom?: ZoomConfiguration
}

/**
 *
 * Vuex Types
 *
 * Mostly copied from https://github.com/vuejs/vuex, adapted where required.
 *
 */

export interface CoreState {
	center: [number, number] | null
	clientHeight: number
	clientWidth: number
	components: number
	// NOTE: The additional values are not required in the configuration but have default values.
	configuration: MapConfig &
	Required<
		Pick<
			MasterportalApiConfig,
			'epsg' | 'namedProjections' | 'options' | 'startResolution'
		>
	>
	hasSmallDisplay: boolean
	hovered: number
	language: string
	map: number
	mapHasDimensions: boolean
	oidcToken: string
	// NOTE truly any since external plugins may bring whatever; unknown will lead to further errors
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	plugin: Record<string, any>
	selected: number
	zoomLevel: number
}

export interface CoreGetters
	extends Omit<CoreState, 'components' | 'hovered' | 'map' | 'selected'> {
	// omitted from CoreState as actual getter type diverges
	components: PluginContainer[]
	hovered: Feature | null
	map: Map
	mapHasDimensions: boolean
	selected: Feature | null
	selectedCoordinate: Coordinate | null

	// regular getters
	deviceIsHorizontal: boolean
	hasSmallHeight: boolean
	hasSmallWidth: boolean
	/** Whether the application currently has the same size as the visual viewport of the users browser */
	hasWindowSize: boolean
}

export type PolarGetter<S, G, P> = (
	state: S,
	getters: G,
	rootState: CoreState,
	rootGetters: CoreGetters
) => P

export type PolarGetterTree<S, G> = {
	[Property in keyof G]: PolarGetter<S, G, G[Property]>
}

export interface PolarActionContext<S, G> {
	dispatch: Dispatch
	commit: Commit
	state: S
	getters: G
	rootState: CoreState
	rootGetters: CoreGetters
}

export type PolarActionHandler<S, G> = (
	this: PolarStore<S, G>,
	injectee: PolarActionContext<S, G>,
	// NOTE: This any is fine, as it can actually be anything.
	// eslint-disable-next-line
	payload?: any
) => unknown

export interface PolarActionObject<S, G> {
	root?: boolean
	handler: PolarActionHandler<S, G>
}

export type PolarAction<S, G> =
	| PolarActionHandler<S, G>
	| PolarActionObject<S, G>

export interface PolarActionTree<S, G> {
	[key: string]: PolarAction<S, G>
}

export interface PolarModule<S, G> {
	namespaced: boolean
	state: S | (() => S)
	getters: PolarGetterTree<S, G>
	actions?: PolarActionTree<S, G>
	mutations: MutationTree<S>
}

export interface PolarModuleTree<S, G> {
	[key: string]: PolarModule<S, G>
}

export interface PolarStoreOptions<S, G> {
	state: S | (() => S)
	getters: PolarGetterTree<S, G>
	actions: PolarActionTree<S, G>
	mutations?: MutationTree<S>
	modules?: PolarModuleTree<S, G>
	plugins?: Plugin<S>[]
	strict?: boolean
	devtools?: boolean
}

export declare class PolarStore<S, G> {
	constructor(options: PolarStoreOptions<S, G>)
	readonly state: S
	readonly getters: G
	replaceState(state: S): void
	// NOTE: options object is removed from type here as it's mostly used for SSR; see https://vuex.vuejs.org/api/#registermodule
	registerModule<LS, LG>(
		path: string | string[],
		module: PolarModule<LS, LG>
	): void

	dispatch: Dispatch
	commit: Commit
	subscribe<P extends MutationPayload>(
		// TODO: check if type any is valid
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		fn: (mutation: P, state: S) => any,
		options?: SubscribeOptions
	): () => void

	subscribeAction<P extends ActionPayload>(
		fn: SubscribeActionOptions<P, S>,
		options?: SubscribeOptions
	): () => void

	watch<T>(
		// TODO: check if type any is valid
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		getter: (state: S, getters: any) => T,
		cb: (value: T, oldValue: T) => void,
		options?: WatchOptions
	): () => void

	unregisterModule(path: string | string[]): void

	hasModule(path: string | string[]): boolean
	hotUpdate(options: {
		actions?: PolarActionTree<S, G>
		mutations?: MutationTree<S>
		getters?: PolarGetterTree<S, G>
		modules?: PolarModuleTree<S, G>
	}): void
}
