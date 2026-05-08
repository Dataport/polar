import type { PluginOptions } from '@/core'

export const PluginId = 'export'

/**
 * Supported export formats.
 */
export const EXPORT_FORMATS = ['jpg', 'jpeg', 'pdf', 'png'] as const

export type ExportFormat = (typeof EXPORT_FORMATS)[number]

export interface ExportPluginOptions extends PluginOptions {
	/**
	 * If `true`, the screenshot will be both stored in the store and offered as a
	 * download to the user. If `false`, it will only be stored – in that case, the
	 * leading application must show a fitting indication (e.g. by firing a
	 * toast or showing the screenshot) to the user.
	 *
	 * @defaultValue `false`
	 */
	download?: boolean

	/**
	 * Defines the export formats to be offered in the export menu.
	 *
	 * @defaultValue `['png']`
	 *
	 *  @remarks
	 * 'jpg' and 'jpeg' are effectively the same format,
	 * so you can provide whatever you prefer. Providing both is not recommended
	 * due to the confusing nature of having both options.
	 */
	formats?: ExportFormat[]
}
