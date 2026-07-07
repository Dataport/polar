/**
 * @module \@polar/polar/plugins/fullscreen
 */

import type { PluginContainer, PolarPluginStore } from '@/core'
import type { FullscreenPluginOptions } from './types'

import component from './components/FullscreenUI.ce.vue'
import locales from './locales'
import { useFullscreenStore } from './store'
import { PluginId } from './types'

/**
 * Creates a plugin which provides a fullscreen mode with a fullscreen toggle button.
 *
 * @returns Plugin for use with {@link @polar/polar!addPlugin | addPlugin}
 */
export default function pluginFullscreen(
	options: FullscreenPluginOptions = {}
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
