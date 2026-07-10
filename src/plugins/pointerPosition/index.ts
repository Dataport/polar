/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/pointerPosition
 */
/* eslint-enable tsdoc/syntax */

import type { PluginContainer, PolarPluginStore } from '@/core'
import type { PointerPositionPluginOptions } from './types'

import component from './components/PointerPosition.ce.vue'
import locales from './locales'
import { usePointerPositionStore } from './store'
import { PluginId } from './types'

/**
 * The PointerPosition plugin makes the current/last pointer position visible
 * as coordinates. An optional select menu is configurable to allow users to
 * switch to their preferred coordinate reference system.
 *
 * @returns Plugin for use with {@link addPlugin}.
 */
export default function pluginPointerPosition(
	options: PointerPositionPluginOptions
): PluginContainer {
	return {
		id: PluginId,
		component,
		locales,
		options,
		storeModule: usePointerPositionStore as PolarPluginStore,
	}
}

export * from './types'
