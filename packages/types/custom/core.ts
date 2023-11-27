import { Feature, Map } from 'ol'
import { Resource } from 'i18next'
import { Options as Fill } from 'ol/style/Fill'
import { Options as Stroke } from 'ol/style/Stroke'
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
import Vue, { WatchOptions } from 'vue'

/**
 *
 * Plugin-Container
 *
 */

export interface PluginOptions {
  displayComponent?: boolean
  layoutTag?: string // TODO: Might it be useful to move declaration of NineLayoutTag here?
}

export type RenderType = 'iconMenu' | 'independent'

/** Possible search methods by type */
export type SearchType = 'bkg' | 'gazetteer' | 'wfs' | 'mpapi'

/**
 * Additional queryParameters for the GET-Request;
 * for the specific parameters for each request,
 * please refer to the types in the plugin
 */
export interface QueryParameters {
  /** Currently used projection of the map */
  epsg: string
  /** sets the maximum number of features to retrieve */
  maxFeatures?: number
  // type:mpapi – these are forwarded to the masterportalApi
  searchAddress?: boolean
  searchDistricts?: boolean
  searchHouseNumbers?: boolean
  searchParcels?: boolean
  searchStreetKey?: boolean
  searchStreets?: boolean
}

export type SearchDisplayMode = 'mixed' | 'categorized'

/** Object containing information for a specific search method */
export interface SearchMethodConfiguration {
  queryParameters?: QueryParameters
  type: SearchType
  url: string
  label?: string
  placeholder?: string
  hint?: string
  groupId?: string
  categoryId?: string
}

export type SearchMethodFunction = (
  signal: AbortSignal,
  url: SearchMethodConfiguration['url'],
  inputValue: string,
  queryParameters: SearchMethodConfiguration['queryParameters']
) => Promise<FeatureCollection> | never

export interface SelectResultPayload {
  feature: GeoJsonFeature
  categoryId: number
}

export type SelectResultFunction = (
  PolarActionContext,
  SelectResultPayload
) => void

/**
 * The suffix of the feature in the FeatureCollection;
 * obsolete with WFS\@3.0.0 as GeoJSON will be the standard response
 */
export type MemberSuffix = 'member' | 'featureMember'

export interface AddressSearchGroupProperties {
  label: string
  placeholder?: string
  hint?: string
  resultDisplayMode: SearchDisplayMode
  limitResults?: number
}

export interface AddressSearchCategoryProperties {
  /** display label for category */
  label: string
}

/** AddressSearch Module Configuration */
export interface AddressSearchConfiguration extends PluginOptions {
  // Minimal input length before the search starts
  minLength: number
  // Time passed in milliseconds before another search is started
  waitMs: number
  // Configured search methods
  searchMethods: SearchMethodConfiguration[]
  // optional additional search methods (client-side injections)
  customSearchMethods?: Record<string, SearchMethodFunction>
  // optional selectResult overrides (client-side injections)
  customSelectResult?: Record<string, SelectResultFunction>
  // definition of categories referred to in searchMethods
  categoryProperties?: Record<string, AddressSearchCategoryProperties>
  focusAfterSearch?: boolean
  // definition of groups referred to in searchMethods
  groupProperties?: Record<string, AddressSearchGroupProperties>
  // optional loading action name to start loading
  addLoading?: string
  // optional loading action name to end loading
  removeLoading?: string
}

export interface Attribution {
  id: string
  title: string
}

/** Attributions Module Configuration */
export interface AttributionsConfiguration extends PluginOptions {
  layerAttributions?: Attribution[]
  staticAttributions?: string[]
  renderType?: RenderType
  initiallyOpen?: boolean
  listenToChanges?: string[]
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

export interface DrawConfiguration extends Partial<PluginOptions> {
  style?: DrawStyle
  textStyle?: TextStyle
  selectableDrawModes?: DrawMode[]
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

/** Configuration of GFI feature regarding a specific layer */
export interface GfiLayerConfiguration {
  /**
   * Whether the found features' geometry, if available, is to be shown on the
   * map. It is simply printed to a helper layer.
   */
  geometry?: boolean
  /**
   * Whether the found features' properties are to be shown in the client's UI.
   * They are displayed as a table, one feature at a time, and if multiple
   * features are found, the user may step through all where the layer's window
   * value is true.
   */
  window?: boolean
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
  /**
   * Property of the features of a service having an url usable to trigger a
   * download of features as a document.
   */
  exportProperty?: string
  // filter method to apply on response features
  filterBy?: 'clickPosition' | undefined
  // name of field to use for geometry, if not default field
  geometryName?: string
  // format the response is known to come in (e.h. "GML")
  format?: string
}

export type BoundaryOnError = 'strict' | 'permissive'

export interface LayerBoundPluginOptions extends PluginOptions {
  /**
   * If set, feature will only be applicable within the layer's features.
   * The layer must contain vectors. This is useful for restricted maps to avoid
   * selecting unfit coordinates.
   */
  boundaryLayerId?: string
  boundaryOnError?: BoundaryOnError
  /**
   * Used if boundaryLayer does not contain the plugin information to inform
   * the user that something could not be set/updated.
   */
  toastAction?: string
}

export interface GeoLocationConfiguration extends LayerBoundPluginOptions {
  /**
   * Source paths through store to listen to for changes; it is assumed values
   * listened to are coordinates that can be used to request information from
   * the specified layers.
   */
  checkLocationInitially: boolean
  /** whether to keep center on user or allow movement after first zoom to */
  keepCentered: boolean
  renderType?: RenderType
  showTooltip?: boolean
  /**
   * Limits the viewable GFIs per layer by this number. The first n elements
   * are chosen arbitrarily. Useful if you e.g. just want one result, or to
   * limit an endless stream of returns to maybe 10 or so. Infinite by default.
   */
  zoomLevel: number
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

/** configurable function to gather additional info */
export type GfiAfterLoadFunction = (
  featureInformation: Record<string, GeoJsonFeature[]>,
  srsName: string // TODO: Might be interesting to overlap this with mapConfig.namedProjections for type safety in using only allowed epsg codes
) => Record<string, GeoJsonFeature[] | symbol>

/** GFI Module Configuration */
export interface FeatureList {
  mode: 'visible' | 'loaded'
  pageLength?: number
  text: (string | ((f: Feature) => string))[]
}

export interface GfiConfiguration extends PluginOptions {
  activeLayerPath?: string
  afterLoadFunction?: GfiAfterLoadFunction
  /**
   * Source paths through store to listen to for changes; it is assumed values
   * listened to are coordinates that can be used to request information from
   * the specified layers.
   */
  coordinateSources: string[]
  /**
   * If required the stroke and fill of the highlighted feature can be configured.
   * Otherwise, a default style is applied.
   */
  customHighlightStyle?: HighlightStyle
  featureList?: FeatureList
  /**
   * Optionally replace GfiContent component.
   * Usable to completely redesign content of GFI window.
   */
  gfiContentComponent?: Vue
  /**
   * The layers to request feature information from. Both WMS and WFS layers are
   * supported. Keys are layer IDs as specified in the services.json registry.
   */
  layers: Record<string, GfiLayerConfiguration>
  /**
   * Limits the viewable GFIs per layer by this number. The first n elements
   * are chosen arbitrarily. Useful if you e.g. just want one result, or to
   * limit an endless stream of returns to maybe 10 or so. Infinite by default.
   */
  maxFeatures?: number
}

export interface Menu {
  id: string
  icon?: string
  plugin: object // TODO: Add a proper type
  // Locale string; if not given `plugins.iconMenu.hints.${id}` is used
  hint?: string
}

export interface IconMenuConfiguration extends PluginOptions {
  menus: Menu[]
  initiallyOpen?: string
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
  appearOnClick: AppearOnClick
  /** Path in store from where coordinates can be retrieved from. */
  coordinateSource: string
  initial?: InitialPin
  /** If the pin should be movable; defaults to false. */
  movable?: boolean | MovablePin
  /** Pin styling */
  style?: PinStyle
  /** The zoom level to zoom to when a pin is added to the map. */
  toZoomLevel: number
}

export interface ReverseGeocoderConfiguration {
  // WPS (Web Processing Service) URL
  url: string
  // points to a coordinate source; on update, coordinate is resolved
  coordinateSource?: string
  // points to an address acceptor; on resolve, address is dispatched there
  addressTarget?: string
  // optional loading action name to start loading
  addLoading?: string
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

export interface ZoomConfiguration extends PluginOptions {
  renderType?: RenderType
  showMobile?: boolean
}

export interface LanguageOption {
  resources: Resource
  /** Language key as described in the i18next documentation */
  type: string
}

export interface PluginContainer {
  language: LanguageOption[]
  name: string
  options: PluginOptions
  plugin: object
  storeModule: object
}

/**
 *
 * Map-Config
 *
 */

export type StrategyOptions = 'all' | 'tile' | 'bbox'
export type LayerType = 'mask' | 'background'

export interface LayerConfigurationOptionLayers {
  /**
   * Comma-separated re-ordering of service layer's 'layer' specification.
   * Layer's not specified in service definition, but in order, are initially
   * invisible. Layers not specified in order, but in service definition, are
   * always visible. Layers specified in both are initially visible. Layers
   * specified in neither are always invisible.
   */
  order: string
  /**
   * Title to be displayed for sub-layer. If false, layer name itself will
   * be used as given in service description 'layers' field. If true, it is
   * assumed a name exists in the layer's GetCapabilities, and that will be
   * used. If Record, it maps the layer name to an arbitrary display name given
   * by the configuration.
   */
  title: boolean | Record<string, string>
  /**
   * Legend image to be used for sub-layer. If false, no image is displayed.
   * If true, it is assumed an image exists in the layer's GetCapabilities, and
   * that will be used. If Record, it maps the layer name to a linked image.
   */
  legend: boolean | Record<string, string>
}

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
  /** Whether the layer should be rendered; defaults to false */
  visibility?: boolean
  /** Whether the layer should be hidden from the LayerChooser selection menu */
  hideInMenu?: boolean
  /** The minimum zoom level the layer will be rendered in; defaults to 0 */
  minZoom?: number
  /** The maximum zoom level the layer will be rendered in; defaults to Number.MAX_SAFE_INTEGER */
  maxZoom?: number
  /** Url to use to proxy the request with */
  proxyUrl?: string
  // TODO: Is the property 'loadingStrategy' still in use?
  loadingStrategy?: StrategyOptions
  /** Enables a configuration feature for the layer in its selection. */
  options?: LayerConfigurationOptions
}

export interface PolarMapOptions {
  resolution: number
  scale: number
  zoomLevel: number
}

/** The initial language the client should be using; defaults to 'de' if not given */
export type InitialLanguage = 'de' | 'en'

export interface MapConfig {
  /** if true, all services' availability will be checked with head requests */
  checkServiceAvailability?: boolean
  /** The epsg code of the projection that the map will use */
  epsg: string
  /** Configured layers */
  layers: LayerConfiguration[]
  /** Enabled projections for the map; 2nd dimension of the array contains the epsg code as the first parameter and the proj4 definition as the second */
  namedProjections: Array<[string, string]>
  /** Mapped resolution to zoomLevel */
  options?: PolarMapOptions[]
  /** Extent in which the map can be viewed in; coordinates are written in the set projection of the map set through this config. */
  extent?: number[]
  language?: InitialLanguage
  locales?: LanguageOption[]
  /** Initial center coordinate for the mapView */
  startCenter?: number[]
  /** Initial resolution the map should be rendered with */
  startResolution?: number
  vuetify?: UserVuetifyPreset
  addressSearch?: AddressSearchConfiguration
  attributions?: AttributionsConfiguration
  draw?: DrawConfiguration
  export?: ExportConfiguration
  fullscreen?: FullscreenConfiguration
  geoLocation?: GeoLocationConfiguration
  gfi?: GfiConfiguration
  iconMenu?: IconMenuConfiguration
  pins?: PinsConfiguration
  reverseGeocoder?: ReverseGeocoderConfiguration
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

export interface PolarError {
  type: 'connection' | 'uncategorized'
  statusCode: number | null
  text: string
}

export interface CoreState {
  map: number
  center: [number, number] | null
  clientHeight: number
  clientWidth: number
  components: number
  zoomLevel: number
  hovered: number
  selected: number
  configuration: MapConfig
  errors: PolarError[]
  plugin: object
}

export interface CoreGetters {
  components: PluginContainer[]
  configuration: MapConfig
  hasSmallHeight: boolean
  hasSmallWidth: boolean
  /** Whether the application currently has the same size as the visual viewport of the users browser */
  hasWindowSize: boolean
  errors: PolarError[]
  map: Map
  hovered: Feature | null
  selected: Feature | null
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
