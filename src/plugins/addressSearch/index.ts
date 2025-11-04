/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/addressSearch
 */
/* eslint-enable tsdoc/syntax */

import component from './components/AddressSearch.ce.vue'
import locales from './locales'
import { useAddressSearchStore } from './store'
import { PluginId } from './types'
import type { PluginContainer, PluginOptions, PolarPluginStore } from '@/core'

/**
 * Creates a plugin which adds the possibility to search for addresses.
 *
 * @returns Plugin for use with {@link addPlugin}.
 */
export default function pluginAddressSearch(options: PluginOptions): PluginContainer {
	return {
		id: PluginId,
		component,
		locales,
		storeModule: useAddressSearchStore as PolarPluginStore,
		options,
	}
}

export * from './types'
