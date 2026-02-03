/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/pins
 */
/* eslint-enable tsdoc/syntax */

import type { PluginContainer, PolarPluginStore } from '@/core'

import locales from './locales'
import { usePinsStore } from './store'
import { PluginId, type PinsOptions } from './types'

/**
 * Pins plugin for POLAR that adds map interactions to client that allow users
 * to indicate a specific point on the map.
 *
 * The plugin handles marking locations. Embedding processes can then use that
 * coordinate for further steps. The plugin may react to other plugins,
 * especially address searches.
 *
 * @returns Plugin for use with {@link addPlugin}.
 */
export default function pluginPins(options: PinsOptions): PluginContainer {
	return {
		id: PluginId,
		locales,
		storeModule: usePinsStore as PolarPluginStore,
		options,
	}
}

export * from './types'
