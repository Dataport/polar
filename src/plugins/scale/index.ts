/**
 * @module \@polar/polar/plugins/scale
 */

import type { PluginContainer, PolarPluginStore } from '@/core'
import type { ScalePluginOptions } from './types'

import component from './components/ScaleWidget.ce.vue'
import locales from './locales'
import { useScaleStore } from './store'
import { PluginId } from './types'

export { beautifyScale } from './utils/beautifyScale'
export { calculateScaleFromResolution } from './utils/calculateScaleFromResolution'

/**
 * Creates a plugin that shows the scale as "1 : x", relative to a line, and/or as a scale selection element.
 * Its options are defined by the zoom options defined by configuration of the {@link @polar/polar!MasterportalApiConfiguration.options | `mapConfiguration.options`}.
 *
 * @returns Plugin for use with {@link @polar/polar!addPlugin | addPlugin}.
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
