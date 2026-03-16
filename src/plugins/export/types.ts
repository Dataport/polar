import type { PluginOptions } from '@/core'

export const PluginId = 'exporter'

export const EXPORT_FORMATS = ['jpg', 'jpeg', 'pdf', 'png']

export type ExportFormat = (typeof EXPORT_FORMATS)[number]

export interface ExportPluginOptions extends PluginOptions {
	/**
	 * Defines whether the file is offered for download.
	 *
	 * @defaultValue `false`
	 */
	download?: boolean

	/**
	 * Defines the export options to be shown in the export menu.
	 * Can be a single format or an array of formats.
	 *
	 * @defaultValue `['png']`
	 */
	options?: ExportFormat | ExportFormat[]

	/**
	 * Defines if the export button is rendered independent or as part of the icon menu.
	 *
	 * This is only applicable if the layout is `'nineRegions'`.
	 *
	 * @defaultValue `'independent'`
	 */
	renderType?: 'independent' | 'iconMenu'
}
