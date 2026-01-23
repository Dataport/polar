/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/attributions
 */
/* eslint-enable tsdoc/syntax */

import type { PluginContainer, PolarPluginStore } from '@/core'

import component from './components/Attributions.ce.vue'
import locales from './locales'
import { useAttributionsStore } from './store'
import { PluginId, type AttributionsPluginOptions } from './types'

/**
 * Creates a plugin which adds attributions (copyright information) regarding all currently active layers.
 * Additionally, static information can be added.
 *
 * @returns Plugin for use with {@link addPlugin}.
 */
export default function pluginAttributions(
	options: AttributionsPluginOptions
): PluginContainer {
	return {
		id: PluginId,
		component,
		locales,
		storeModule: useAttributionsStore as PolarPluginStore,
		options,
	}
}

export * from './types'
