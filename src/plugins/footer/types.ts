import type { PluginContainer, PluginOptions } from '@/core'

export const PluginId = 'footer'

/**
 * Plugin options for footer plugin.
 */
export interface FooterOptions extends PluginOptions {
	/**
	 * Plugins that are going to be directly rendered on the left side of the footer.
	 */
	leftEntries: PluginContainer[]

	/**
	 * Plugins that are going to be directly rendered on the right side of the footer.
	 */
	rightEntries: PluginContainer[]
}
