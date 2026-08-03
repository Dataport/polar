/**
 * @module \@polar/polar/plugins/loadingIndicator
 */

import type { PluginContainer, PolarPluginStore } from '@/core'
import type { LoadingIndicatorOptions } from './types'

import component from './components/LoadingIndicator.ce.vue'
import { useLoadingIndicatorStore } from './store'
import { PluginId } from './types'

/**
 * Creates a plugin that offers a generic loading indicator that may be used by
 * any plugin or outside procedure to indicate loading.
 *
 * @returns Plugin for use with {@link @polar/polar!addPlugin | addPlugin}
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
