/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/reverseGeocoder
 */
/* eslint-enable tsdoc/syntax */

import type { PluginContainer, PolarPluginStore } from '@/core'

import { useReverseGeocoderStore } from './store'
import { PluginId, type ReverseGeocoderPluginOptions } from './types'

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
		storeModule: useReverseGeocoderStore as PolarPluginStore,
		options,
	}
}

export * from './types'
