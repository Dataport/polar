/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/loadingIndicator
 */
/* eslint-enable tsdoc/syntax */

import component from './components/LoadingIndicator.ce.vue'
import { useLoadingIndicatorStore } from './store'
import { type LoadingIndicatorOptions, PluginId } from './types'
import type { PluginContainer, PolarPluginStore } from '@/core'

/**
 * Creates a plugin that offers a generic loading indicator that may be used by
 * any plugin or outside procedure to indicate loading.
 *
 * @returns Plugin for use with {@link addPlugin}.
 */
export default function pluginLoadingIndicator(
	options: LoadingIndicatorOptions
): PluginContainer {
	return {
		id: PluginId,
		component,
		storeModule: useLoadingIndicatorStore as PolarPluginStore,
		options,
	}
}

export * from './types'
