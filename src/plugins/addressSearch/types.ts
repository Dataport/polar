import type { PluginOptions } from '@/core'

export const PluginId = 'addressSearch'

export interface AddressSearchOptions extends PluginOptions {
	/**
	 * Time passed in milliseconds before another search is started.
	 *
	 * @defaultValue 0
	 */
	waitMs?: number
}
