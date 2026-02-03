/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/fullscreen
 */
/* eslint-enable tsdoc/syntax */

import type { PluginContainer, PolarPluginStore } from '@/core'

import component from './components/FullscreenUI.ce.vue'
import locales from './locales'
import { useFullscreenStore } from './store'
import { PluginId, type FullscreenOptions } from './types'

/**
 * Creates a plugin which provides a fullscreen mode with a fullscreen toggle button.
 *
 * @returns Plugin for use with {@link addPlugin}
 */
export default function pluginFullscreen(
	options: FullscreenOptions = {}
): PluginContainer {
	return {
		id: PluginId,
		component,
		locales,
		storeModule: useFullscreenStore as PolarPluginStore,
		options,
	}
}

export * from './types'
