/* eslint-disable tsdoc/syntax */
/**
 * This is the documentation for the locales keys in the reverse geocoder plugin.
 * These locales are *NOT* exported, but documented only.
 *
 * @module locales/plugins/reverseGeocoder
 */
/* eslint-enable tsdoc/syntax */

import type { Locale } from '@/core'

/**
 * German locales for reverse geocoder plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesDe = {} as const

/**
 * English locales for reverse geocoder plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesEn = {} as const

/**
 * Reverse geocoder plugin locales.
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
