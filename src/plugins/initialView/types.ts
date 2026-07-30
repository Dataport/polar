/**
 * Defines if the geoLocation button is rendered independent or as part of the
 * icon menu.
 * @defaultValue `'independent'`
 */

import type { PluginOptions } from '@/core'

export const PluginId = 'initialView' as const

export interface InitialViewPluginOptions extends PluginOptions {
	renderType?: 'independent' | 'iconMenu'
	startCenter?: [number, number]
	startResolution?: number
}
