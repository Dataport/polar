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
 * The plugin offers global functionality to display text messages to the user.
 * These are the classic success, warning, info, and error messages,
 * helping to understand what's going on or why something happened.
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
