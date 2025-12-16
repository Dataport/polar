import type { Feature } from 'geojson'
import type { PluginId as PolarPluginId, PluginOptions } from '@/core'

/**
 * Plugin identifier.
 */
export const PluginId = 'reverseGeocoder'

/**
 * Plugin options for reverse geocoder plugin.
 */
export interface ReverseGeocoderPluginOptions extends PluginOptions {
	/**
	 * URL of a WPS service to use for reverse geocoding.
	 */
	url: string

	/**
	 * Store state parameter that should receive the result of the reverse geocoding.
	 */
	addressTarget?: {
		plugin?: PolarPluginId
		target: string
	}

	/**
	 * Array of store fields that contain a coordinate.
	 * If a coordinate is refreshed, reverse geocoding for that coordinate is done automatically.
	 */
	coordinateSources?: {
		plugin?: PolarPluginId
		source: string
	}[]

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
