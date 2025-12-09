/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/footer
 */
/* eslint-enable tsdoc/syntax */

import component from './components/PolarFooter.ce.vue'
import locales from './locales'
import { useFooterStore } from './store'
import { PluginId, type FooterPluginOptions } from './types'
import type { PluginContainer, PolarPluginStore } from '@/core'

/**
 * Creates a plugin which adds the possibility to display various content as a
 * footer at the bottom of the map.
 *
 * Note that a link to the POLAR repository will always be displayed.
 *
 * @returns Plugin for use with {@link addPlugin}.
 */
export default function pluginFooter(
	options: FooterPluginOptions
): PluginContainer {
	return {
		id: PluginId,
		component,
		locales,
		storeModule: useFooterStore as PolarPluginStore,
		options,
	}
}

export * from './types'
