/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/gfi
 */
/* eslint-enable tsdoc/syntax */

import type { PluginContainer, PolarPluginStore } from '@/core'

import component from './components/GfiUI.ce.vue'
import locales from './locales'
import { useGfiStore } from './store'
import { PluginId, type GfiPluginOptions } from './types'

/**
 * Creates a plugin which fetches and optionally displays GFI (GetFeatureInfo) from WMS and WFS services or layers based on GeoJSON files.
 * The feature information is accessible in the store and can also be accessed for custom display logic.
 *
 * @returns Plugin for use with {@link addPlugin}
 */
export default function pluginGfi(options: GfiPluginOptions): PluginContainer {
	return {
		id: PluginId,
		component,
		locales,
		storeModule: useGfiStore as PolarPluginStore,
		options,
		icon: 'kern-icon--map-pin-heart',
	}
}

export * from './types'
