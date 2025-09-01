/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/layerChooser
 */
/* eslint-enable tsdoc/syntax */

import component from './components/LayerChooser.ce.vue'
import locales from './locales'
import { useLayerChooserStore } from './store'
import { PluginId, type LayerChooserPluginOptions } from './types'
import type { PluginContainer } from '@/core'

/**
 * Creates a plugin that offers an additive (usually Overlays, technically named
 * with `type: 'mask'`) and an exclusive (usually background maps,
 * `type: 'background'`) selection of layers to the users.
 *
 * Order of layers within a layer is always as initially configured.
 *
 * @returns Plugin for use with {@link addPlugin}.
 */
export default function pluginLayerChooser(
	options: LayerChooserPluginOptions
): PluginContainer {
	return {
		id: PluginId,
		component,
		locales,
		storeModule: useLayerChooserStore,
		options,
	}
}

export * from './types'
