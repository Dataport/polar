import type { PluginContainer, PluginOptions } from '@/core'

export const PluginId = 'footer'

/**
 * Plugin options for footer plugin.
 */
export interface FooterPluginOptions extends PluginOptions {
	/**
	 * Plugins that are going to be directly rendered as part of the footer.
	 */
	entries: PluginContainer[]
}
