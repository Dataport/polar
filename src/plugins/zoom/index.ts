/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/zoom
 */
/* eslint-enable tsdoc/syntax */

import type { PluginContainer, PolarPluginStore } from '@/core'

import component from './components/ZoomUI.ce.vue'
import locales from './locales'
import { useZoomStore } from './store'
import { PluginId, type ZoomPluginOptions } from './types'

/**
 * Creates a plugin which provides zoom buttons and a zoom slider.
 *
 * @returns Plugin for use with {@link addPlugin}
 */
export default function pluginZoom(
	options: ZoomPluginOptions = {}
): PluginContainer {
	return {
		id: PluginId,
		component,
		locales,
		storeModule: useZoomStore as PolarPluginStore,
		options,
	}
}

export * from './types'
