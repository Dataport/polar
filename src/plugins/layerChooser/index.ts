/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/layerChooser
 */
/* eslint-enable tsdoc/syntax */

import component from './components/LayerChooser.ce.vue'
import locales from './locales'
import { useLayerChooserStore } from './store'
import { PluginId } from './types'
import type { PluginContainer, PluginOptions, PolarPluginStore } from '@/core'

/**
 * Creates a plugin that offers an additive (usually Overlays, technically named
 * with `type: 'mask'`) and an exclusive (usually background maps,
 * `type: 'background'`) selection of layers to the users.
 *
 * Order of layers within a layer is always as initially configured.
 *
 * The tool does not require any configuration for itself but is based on the
 * {@link MapConfiguration.layers | `mapConfiguration.layers`}.
 * It will infer `id` and `name` from that configuration.
 *
 * @returns Plugin for use with {@link addPlugin}.
 */
export default function pluginLayerChooser(
	options: PluginOptions
): PluginContainer {
	return {
		id: PluginId,
		component,
		icon: 'kern-icon-fill--layers',
		locales,
		storeModule: useLayerChooserStore as PolarPluginStore,
		options,
	}
}

export * from './types'
