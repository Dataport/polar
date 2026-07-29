import type { PluginOptions } from '@/core'

export const PluginId = 'initialView' as const

export interface InitialViewPluginOptions extends PluginOptions {
	startCenter?: [number, number]
	startResolution?: number
}
