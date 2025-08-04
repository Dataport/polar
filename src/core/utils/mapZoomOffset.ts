import type { MapConfiguration } from '../types'

/**
 * NOTE This is a workaround addressing the recent change in `minZoom` logic in
 * the `@masterportal/masterportalapi`. Previously, the `minZoom` would be used
 * to decide for a resolution, which was inclusive, but now `minZoom` is
 * forwarded, which is exclusive.
 *
 * To avoid breaking changes, we're simply mapping the `minZoom` before
 * forwarding the configuration to the value usage intended in POLAR; that is,
 * inclusive.
 */
export const mapZoomOffset = (
	mapConfiguration: MapConfiguration
): MapConfiguration => {
	return {
		...mapConfiguration,
		layers: mapConfiguration.layers.map((entry) =>
			typeof entry.minZoom !== 'undefined'
				? { ...entry, minZoom: entry.minZoom - 1 }
				: entry
		),
	}
}
