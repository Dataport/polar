/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/export
 */
/* eslint-enable tsdoc/syntax */

import type { PluginContainer, PolarPluginStore } from '@/core'

import component from './components/ExportUI.ce.vue'
import locales from './locales'
import { useExportStore } from './store'
import { PluginId, type ExportPluginOptions } from './types'

/**
 * The Export plugin allows making screenshots of the currently visible map.
 *
 * @returns Plugin for use with {@link addPlugin}.
 */
export default function pluginExport(
	options: ExportPluginOptions
): PluginContainer {
	return {
		id: PluginId,
		component,
		locales,
		storeModule: useExportStore as PolarPluginStore,
		options,
	}
}

export * from './types'
