/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/iconMenu
 */
/* eslint-enable tsdoc/syntax */

import component from './components/IconMenu.ce.vue'
import locales from './locales'
import { useIconMenuStore } from './store'
import { PluginId, type IconMenuPluginOptions } from './types'
import type { PluginContainer } from '@/core'

/**
 * Creates a plugin which adds the possibility to open various functionality as
 * cards from an iconized menu.
 * This way, obstructive UI can be hidden until the user desires to open it.
 *
 * Please use carefully – users may have issues finding process-relevant
 * buttons or interactions if you hide them here.
 *
 * @returns Plugin for use with {@link addPlugin}.
 */
export default function pluginIconMenu(
	options: IconMenuPluginOptions
): PluginContainer {
	return {
		id: PluginId,
		component,
		locales,
		storeModule: useIconMenuStore,
		options: {
			displayComponent: true,
			...options,
		},
	}
}

export * from './types'
