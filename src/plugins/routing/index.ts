/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/routing
 */
/* eslint-enable tsdoc/syntax */

import type { PluginContainer, PolarPluginStore } from '@/core'

import component from './components/RoutingWrapper.ce.vue'
import locales from './locales'
import { useRoutingStore } from './store'
import { PluginId, type RoutingPluginOptions } from './types'

/**
 * Creates a plugin which offers routing functionality to the user.
 *
 * A user can select multiple waypoints by clicking on the map, which then are converted to an address, if the `reverseGeocoder` plugin is configured.
 * If at least two waypoints have been added, the route is automatically calculated and displayed on the map.
 *
 * The travel mode can be adjusted as well as the types of routes to avoid.
 * Similarly, the route preference is set to `'recommended'` by default, but can be changed to `'fastest'` or `'shortest'`.
 *
 * Once a route is available, a detailed listing of every route segment is available including instructions, distance and duration.
 *
 * @returns Plugin for use with {@link addPlugin}.
 */
export default function pluginRouting(
	options: RoutingPluginOptions
): PluginContainer {
	return {
		id: PluginId,
		component,
		locales,
		storeModule: useRoutingStore as PolarPluginStore,
		options,
	}
}

export * from './types'
