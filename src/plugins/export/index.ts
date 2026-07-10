/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/export
 */
/* eslint-enable tsdoc/syntax */

import type { PluginContainer, PolarPluginStore } from '@/core'
import type { ExportPluginOptions } from './types'

import component from './components/ExportUI.ce.vue'
import locales from './locales'
import { useExportStore } from './store'
import { PluginId } from './types'

/**
 * The Export plugin allows making screenshots of the currently visible map.
 * Please note that the plugin must be added initially, before any layers are
 * loaded, or the canvas will no longer be printable due to potential security
 * issues.
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
