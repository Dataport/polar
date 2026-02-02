/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/addressSearch
 */
/* eslint-enable tsdoc/syntax */

import type { PluginContainer, PolarPluginStore } from '@/core'

import component from './components/AddressSearch.ce.vue'
import locales from './locales'
import { useAddressSearchStore } from './store'
import { type AddressSearchOptions, PluginId } from './types'

/**
 * Creates a plugin which adds a user interface to search for various kinds of textual information to map it to a
 * geometry; e.g. parcel numbers or addresses, but any kind of toponym mapping is possible.
 * If multiple addresses are returned by services, the user is prompted to select a result.
 *
 * All results, including one selected by a user, are saved as GeoJSON for further processing.
 *
 * Currently supported services:
 * - BKG
 * - WFS
 * - Hamburg WFS-G (`mpapi`), may fit some WFS-G outside HH, testing is advised
 *
 * @returns Plugin for use with {@link addPlugin}.
 */
export default function pluginAddressSearch(
	options: AddressSearchOptions
): PluginContainer {
	return {
		id: PluginId,
		component,
		locales,
		storeModule: useAddressSearchStore as PolarPluginStore,
		options,
	}
}

export * from './types'
