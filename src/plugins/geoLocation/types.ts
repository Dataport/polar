import type { LayerBoundPluginOptions } from '@/core'

/**
 * Plugin identifier.
 */
export const PluginId = 'geoLocation'

/**
 * Current state of the GeoLocation plugin.
 */
export type PluginState = 'LOCATABLE' | 'LOCATED' | 'DISABLED'

/**
 * Plugin options for geoLocation plugin.
 */
export interface GeoLocationPluginOptions extends LayerBoundPluginOptions {
	/**
	 * If `true`, the location check will be run on map start-up. If `false`, the
	 * feature has to be triggered with a button press by the user.
	 *
	 * @defaultValue `false`
	 */
	checkLocationInitially?: boolean

	/**
	 * If `true`, the map will re-center on the user on any position change. This
	 * effectively hinders map panning on moving devices.
	 *
	 * If `false`, only the first position will be centered on.
	 *
	 * @defaultValue `false`
	 */
	keepCentered?: boolean

	/**
	 * If set to `true`, a tooltip will be shown when hovering the geoposition
	 * marker on the map, indicating that it shows the user's position.
	 *
	 * @defaultValue `false`
	 */
	showTooltip?: boolean

	/**
	 * Zoom level to zoom to on geolocating the user and panning to the position.
	 *
	 * @defaultValue `7`
	 */
	zoomLevel?: number
}
