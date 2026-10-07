/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/zoom
 */
/* eslint-enable tsdoc/syntax */

import type { PluginContainer } from '@/core'
import type { ZoomPluginOptions } from './types'

import component from './components/ZoomUI.ce.vue'
import locales from './locales'
import { useZoomStore } from './store'
import { PluginId } from './types'

/**
 * Creates a plugin which provides UI and functionality regarding zooming.
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
		storeModule: useZoomStore,
		options,
	}
}

export * from './types'
