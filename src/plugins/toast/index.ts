/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/toast
 */
/* eslint-enable tsdoc/syntax */

import component from './components/ToastContainer.ce.vue'
import locales from './locales'
import { useToastStore } from './store'
import { PluginId, type ToastPluginOptions } from './types'
import type { PluginContainer, PolarPluginStore } from '@/core'

/**
 * Creates a plugin which provides toast messages.
 *
 * @returns Plugin for use with {@link addPlugin}
 */
export default function pluginToast(
	options: ToastPluginOptions
): PluginContainer {
	return {
		id: PluginId,
		component,
		locales,
		storeModule: useToastStore as PolarPluginStore,
		options,
	}
}

export * from './types'
