import type { Feature } from 'geojson'
import type { PluginOptions, StoreReference } from '@/core'

/**
 * Plugin identifier.
 */
export const PluginId = 'reverseGeocoder'

/**
 * Plugin options for reverse geocoder plugin.
 */
export interface ReverseGeocoderPluginOptions extends PluginOptions {
	/**
	 * Type of reverse geocoding service.
	 */
	type: 'wps' | 'nominatim'

	/**
	 * URL of a WPS service to use for reverse geocoding.
	 */
	url: string

	/**
	 * Store actions that should receive the result of the reverse geocoding.
	 */
	addressTarget?: StoreReference

	/**
	 * Array of store fields that contain a coordinate.
	 * If a coordinate is refreshed, reverse geocoding for that coordinate is done automatically.
	 */
	coordinateSources?: StoreReference[]

	/**
	 * EPSG code of the coordinate system used by the service.
	 * Considered only if {@link ReverseGeocoderPluginOptions.type | type} is set to `'wps'`.
	 *
	 * @defaultValue `'EPSG:25832'`
	 */
	epsg?: string

	/**
	 * Escape hatch: Also reverse geocode coordinates that originated from the
	 * {@link ReverseGeocoderPluginOptions.addressTarget | addressTarget}
	 * (e.g. a pin set via search). The result is only forwarded, without zooming.
	 *
	 * @remarks
	 * The `addressTarget` must ignore features of type `'reverse_geocoded'`
	 * (as `pins` does), otherwise an infinite loop occurs.
	 *
	 * @defaultValue `false`
	 */
	forwardOriginatingChanges?: boolean

	/**
	 * Zoom level to zoom to when a successful answer was received.
	 */
	zoomTo?: number
}

// a little clunky, but this has been established
export type ReverseGeocoderFeature = Omit<Feature, 'type'> & {
	type: 'reverse_geocoded'
	title: string
	addressGeometry: Feature['geometry']
}
