/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/scale
 */
/* eslint-enable tsdoc/syntax */

import type { PluginContainer, PolarPluginStore } from '@/core'

import component from './components/ScaleWidget.ce.vue'
import locales from './locales'
import { useScaleStore } from './store'
import { type ScalePluginOptions, PluginId } from './types'

export { beautifyScale } from './utils/beautifyScale'
export { calculateScaleFromResolution } from './utils/calculateScaleFromResolution'

/**
 * Creates a plugin that shows the scale as "1 : x", relative to a line, and/or as a scale selection element.
 * Its options are defined by the zoom options defined by configuration of the {@link MasterportalApiConfiguration.options | `mapConfiguration.options`}.
 *
 * @returns Plugin for use with {@link addPlugin}.
 */
export default function pluginScale(
	options: ScalePluginOptions
): PluginContainer {
	return {
		id: PluginId,
		component,
		locales,
		options,
		storeModule: useScaleStore as PolarPluginStore,
	}
}

export * from './types'
