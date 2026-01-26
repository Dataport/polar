import type { PluginOptions } from '@/core'

export const PluginId = 'scale'

export interface ScalePluginOptions extends PluginOptions {
	/**
	 * If set to `true`, the `1 : x` text will be replaced with a select element
	 * that allows switching between scale values. Defaults to `false`. Requires
	 * the configuration parameter {@link MapConfiguration.options} to be set.
	 */
	showScaleSwitcher?: boolean
}
