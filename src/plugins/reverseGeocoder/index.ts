/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/reverseGeocoder
 */
/* eslint-enable tsdoc/syntax */

import locales from './locales'
import { useReverseGeocoderStore } from './store'
import { PluginId, type ReverseGeocoderPluginOptions } from './types'
import type { PluginContainer, PolarPluginStore } from '@/core'

/**
 * Creates a plugin which converts coordinates into addresses.
 *
 * @returns Plugin for use with {@link addPlugin}
 */
export default function pluginReverseGeocoder(
	options: ReverseGeocoderPluginOptions
): PluginContainer {
	return {
		id: PluginId,
		locales,
		storeModule: useReverseGeocoderStore as PolarPluginStore,
		options,
	}
}

export * from './types'
