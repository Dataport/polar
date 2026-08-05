/* eslint-disable tsdoc/syntax */
/**
 * @module @polar/polar/plugins/InitialView
 */
/* eslint-enable tsdoc/syntax */

import type { PluginContainer, PolarPluginStore } from '@/core'
import type { InitialViewPluginOptions } from './types'

import component from './components/InitialView.ce.vue'
import locales from './locales'
import { useInitialViewStore } from './store'
import { PluginId } from './types'

/**
 * Creates a plugin which offers a button to return to the map's start view.
 *
 * @returns Plugin for use with {@link addPlugin}.
 */
export default function pluginInitialView(
	options: InitialViewPluginOptions = {}
): PluginContainer {
	return {
		id: PluginId,
		component,
		locales,
		storeModule: useInitialViewStore as PolarPluginStore,
		options,
	}
}

export * from './types'
