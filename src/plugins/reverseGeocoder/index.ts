/**
 * @module \@polar/polar/plugins/reverseGeocoder
 */

import type { PluginContainer, PolarPluginStore } from '@/core'
import type { ReverseGeocoderPluginOptions } from './types'

import { useReverseGeocoderStore } from './store'
import { PluginId } from './types'

/**
 * Creates a plugin which converts coordinates into addresses.
 *
 * @returns Plugin for use with {@link @polar/polar!addPlugin | addPlugin}
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
