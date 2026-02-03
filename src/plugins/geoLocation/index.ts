/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/geoLocation
 */
/* eslint-enable tsdoc/syntax */

import type { PluginContainer, PolarPluginStore } from '@/core'

import component from './components/GeoLocation.ce.vue'
import locales from './locales'
import { useGeoLocationStore } from './store'
import { PluginId, type GeoLocationOptions } from './types'

/**
 * The GeoLocation plugin is responsible for collecting and displaying a user's
 * GPS location for display on the map. The tracking can be triggered initially
 * on startup or via a button.
 *
 * If a users denies the location tracking, the button for this plugin gets
 * disabled and indicates the user's decision.
 *
 * @returns Plugin for use with {@link addPlugin}.
 */
export default function pluginGeoLocation(
	options: GeoLocationOptions
): PluginContainer {
	return {
		id: PluginId,
		component,
		locales,
		storeModule: useGeoLocationStore as PolarPluginStore,
		options,
	}
}

export * from './types'
