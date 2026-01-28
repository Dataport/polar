/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/filter
 */
/* eslint-enable tsdoc/syntax */

import type { PluginContainer, PolarPluginStore } from '@/core'

import component from './components/FilterUI.ce.vue'
import locales from './locales'
import { useFilterStore } from './store'
import { PluginId, type FilterPluginOptions } from './types'

/**
 * Creates a plugin which allows to filter arbitrary configurable vector layers by their properties.
 *
 * @returns Plugin for use with {@link addPlugin}
 */
export default function pluginFilter(
	options: FilterPluginOptions
): PluginContainer {
	return {
		id: PluginId,
		component,
		locales,
		icon: 'kern-icon--filter-alt',
		storeModule: useFilterStore as PolarPluginStore,
		options,
	}
}

export * from './types'
