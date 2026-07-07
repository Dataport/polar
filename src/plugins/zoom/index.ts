/**
 * @module \@polar/polar/plugins/zoom
 */

import type { PluginContainer, PolarPluginStore } from '@/core'
import type { ZoomPluginOptions } from './types'

import component from './components/ZoomUI.ce.vue'
import locales from './locales'
import { useZoomStore } from './store'
import { PluginId } from './types'

/**
 * Creates a plugin which provides UI and functionality regarding zooming.
 *
 * @returns Plugin for use with {@link @polar/polar!addPlugin | addPlugin}
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
