/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/draw
 */
/* eslint-enable tsdoc/syntax */

import type { PluginContainer, PolarPluginStore } from '@/core'

import component from './components/DrawGadget.ce.vue'
import locales from './locales'
import { useDrawStore } from './store'
import { type DrawPluginOptions, PluginId } from './types'

/**
 * TODO:
 *
 * @returns Plugin for use with {@link addPlugin}
 */
export default function pluginFilter(
	options: DrawPluginOptions
): PluginContainer {
	return {
		id: PluginId,
		component,
		locales,
		icon: 'kern-icon-fill--brush',
		storeModule: useDrawStore as PolarPluginStore,
		options,
	}
}

export * from './types'
