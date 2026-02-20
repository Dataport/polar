import type { VueElement } from 'vue'

import type { FilterPluginOptions } from '@/plugins/filter'
import type { FooterPluginOptions } from '@/plugins/footer'
import type { FullscreenPluginOptions } from '@/plugins/fullscreen'
import type { GeoLocationPluginOptions } from '@/plugins/geoLocation'
import type { IconMenuPluginOptions } from '@/plugins/iconMenu'
import type { LoadingIndicatorOptions } from '@/plugins/loadingIndicator'
import type { PinsPluginOptions } from '@/plugins/pins'
import type { ReverseGeocoderPluginOptions } from '@/plugins/reverseGeocoder'
import type { ScalePluginOptions } from '@/plugins/scale'
import type { ToastPluginOptions } from '@/plugins/toast'

import type defaults from '../utils/defaults'
import type { LayerConfiguration } from './layer'
import type { LocaleOverride } from './locales'
import type { MarkerConfiguration } from './marker'
import type { PluginId } from './plugin'
import type { PolarTheme } from './theme'

export interface ServiceAvailabilityCheck {
	ping: Promise<number>
	serviceId: string
	serviceName: string
}

export interface StoreReference {
	key: string
	plugin?: PluginId
}

export type InitialLanguage = 'de' | 'en'

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

/**
 * Service register for use with `@masterportal/masterportalapi`.
 *
 * Whitelisted and confirmed parameters include:
 * - WMS:      `id`, `name`, `url`, `typ`, `format`, `version`, `transparent`, `layers`, `styles`, `singleTile`
 * - WFS:      `id`, `name`, `url`, `typ`,  `outputFormat`, `version`, `featureType`
 * - WMTS:     `id`, `name`, `urls`, `typ`, `capabilitiesUrl`, `optionsFromCapabilities`, `tileMatrixSet`, `layers`,
 *             `legendURL`, `format`, `coordinateSystem`, `origin`, `transparent`, `tileSize`, `minScale`, `maxScale`,
 *             `requestEncoding`, `resLength`
 * - OAF:      `id`, `name`, `url`, `typ`, `collection`, `crs`, `bboxCrs`
 * - GeoJSON:  `id`, `name`, `url`, `typ`, `version`, `minScale`, `maxScale`, `legendURL`
 *
 * To load this from an URL, call {@link fetchServiceRegister}.
 * You may also pass the URL directly to the `serviceRegister` parameter of {@link createMap}.
 *
 * An example for a predefined service register is [the service register of the city of Hamburg](https://geodienste.hamburg.de/services-internet.json).
 * Full documentation regarding the configuration can be read [here](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/doc/services.json.md).
 * However, not all listed services have been implemented in the `@masterportal/masterportalapi` yet,
 * and no documentation regarding implemented properties exists there yet.
 */
export type MasterportalApiServiceRegister = Record<string, unknown>[]

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

export type ColorScheme = 'dark' | 'light' | 'system'

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
	 * Color scheme the client should be using.
	 * If set to `system`, the color scheme is chosen according to the user's system preferences.
	 *
	 * @defaultValue `'system'`
	 */
	colorScheme?: ColorScheme

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
	 * 			layerChooser: {
	 * 				maskTitle: 'Bahnstrecken',
	 * 			},
	 * 		},
	 * 	},
	 * 	{
	 * 		type: 'en',
	 * 		resources: {
	 * 			layerChooser: {
	 * 				maskTitle: 'Railway lines',
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
	locales?: LocaleOverride[]

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
	secureServiceUrlRegex?: RegExp

	/**
	 * Custom theme for POLAR.
	 *
	 * The default is to use KERN's standard theme.
	 */
	theme?: PolarTheme

	// Plugins are not sorted alphabetical, but listed last.
	// Remember to sort them alphabetical inside their space.
	// TODO: Generate this section via types/plugin.ts
	/* eslint-disable perfectionist/sort-interfaces */

	/** Configuration for filter plugin. */
	filter?: FilterPluginOptions

	/** Configuration for footer plugin. */
	footer?: FooterPluginOptions

	/**  Configuration for fullscreen plugin. */
	fullscreen?: FullscreenPluginOptions

	/** Configuration for geoLocation plugin. */
	geoLocation?: GeoLocationPluginOptions

	/** Configuration for iconMenu plugin. */
	iconMenu?: IconMenuPluginOptions

	/** Configuration for loadingIndicator plugin. */
	loadingIndicator?: LoadingIndicatorOptions

	/** Configuration for pins plugin. */
	pins?: PinsPluginOptions

	/** Configuration for reverseGeocoder plugin. */
	reverseGeocoder?: ReverseGeocoderPluginOptions

	/** Configuration for scale plugin. */
	scale?: ScalePluginOptions

	/** Configuration for toast plugin. */
	toast?: ToastPluginOptions
	/* eslint-enable perfectionist/sort-interfaces */
}

export type MapConfigurationIncludingDefaults = MapConfiguration &
	typeof defaults
