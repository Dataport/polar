/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/iconMenu
 */
/* eslint-enable tsdoc/syntax */

import component from './components/IconMenu.vue'
import locales from './locales'
import { useIconMenuStore } from './store'
import { PluginId, type IconMenuPluginOptions } from './types'
import type { PluginContainer } from '@/core'

/**
 * Creates a plugin which adds the possibility to open other plugins from an
 * iconized menu.
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
