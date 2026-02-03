import type { PluginOptions } from '@/core'

export const PluginId = 'scale'

export interface ScaleOptions extends PluginOptions {
	/**
	 * If set to `true`, the `1 : x` text will be replaced with a select element
	 * that allows switching between scale values. Requires the configuration
	 * parameter {@link MapConfiguration.options} to be set.
	 * @defaultValue false
	 */
	showScaleSwitcher?: boolean
}
