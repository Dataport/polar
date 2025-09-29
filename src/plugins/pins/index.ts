/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/pins
 */
/* eslint-enable tsdoc/syntax */

import locales from './locales'
import { usePinsStore } from './store'
import { PluginId, type PinsPluginOptions } from './types'
import type { PluginContainer, PolarPluginStore } from '@/core'

/**
 * TODO
 *
 * @returns Plugin for use with {@link addPlugin}.
 */
export default function pluginPins(
	options: PinsPluginOptions
): PluginContainer {
	return {
		id: PluginId,
		locales,
		storeModule: usePinsStore as PolarPluginStore,
		options,
	}
}

export * from './types'
