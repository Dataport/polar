/**
 * @module \@polar/polar/plugins/toast
 */

import type { PluginContainer, PolarPluginStore } from '@/core'
import type { ToastPluginOptions } from './types'

import component from './components/ToastContainer.ce.vue'
import locales from './locales'
import { useToastStore } from './store'
import { PluginId } from './types'

/**
 * Creates a plugin which provides toast messages.
 *
 * The plugin offers global functionality to display text messages to the user.
 * These are the classic success, warning, info, and error messages,
 * helping to understand what's going on or why something happened.
 *
 * @returns Plugin for use with {@link @polar/polar!addPlugin | addPlugin}
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
