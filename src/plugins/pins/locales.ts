/* eslint-disable tsdoc/syntax */
/**
 * This is the documentation for the locales keys in the pins plugin.
 * These locales are *NOT* exported, but documented only.
 *
 * @module locales/plugins/pins
 */
/* eslint-enable tsdoc/syntax */

import type { Locale } from '@/core'

/**
 * German locales for pins plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesDe = {} as const

/**
 * English locales for pins plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesEn = {} as const

/**
 * Pins plugin locales.
 *
 * @privateRemarks
 * The first entry will be used as fallback.
 *
 * @internal
 */
const locales: Locale[] = [
	{
		type: 'de',
		resources: resourcesDe,
	},
	{
		type: 'en',
		resources: resourcesEn,
	},
]

export default locales
