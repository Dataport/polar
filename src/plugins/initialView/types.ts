import type { PluginOptions } from '@/core'

export const PluginId = 'initialView' as const

export interface InitialViewPluginOptions extends PluginOptions {
	/**
	 * Defines if the initialView button is rendered independent or as part of the
	 * icon menu.
	 * @defaultValue `'independent'`
	 */
	renderType?: 'independent' | 'iconMenu'
}
