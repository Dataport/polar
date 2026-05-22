/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/draw
 */
/* eslint-enable tsdoc/syntax */

import type { PluginContainer } from '@/core'
import type { DrawPluginOptions } from './types'

import component from './components/DrawGadget.ce.vue'
import locales from './locales'
import { useDrawStore } from './store'
import { PluginId } from './types'

/**
 * Creates a plugin that lets users draw.
 *
 * @returns Plugin for use with {@link addPlugin}.
 */
export default function pluginDraw(
	options: DrawPluginOptions
): PluginContainer {
	return {
		id: PluginId,
		component,
		locales,
		icon: 'kern-icon-fill--brush',
		// TODO: red squibbly line
		storeModule: useDrawStore,
		options,
	}
}

export * from './types'
