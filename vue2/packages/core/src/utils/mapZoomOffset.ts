import { MapConfig } from '@polar/lib-custom-types'

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
export const mapZoomOffset = (mapConfiguration: MapConfig): MapConfig => {
  if (mapConfiguration.layers) {
    return {
      ...mapConfiguration,
      layers: mapConfiguration.layers.map((entry) => {
        if (typeof entry.minZoom !== 'undefined') {
          return { ...entry, minZoom: entry.minZoom - 1 }
        }
        return entry
      }),
    }
  }
  return mapConfiguration
}
