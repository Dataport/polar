import type { Locale } from '@/core'

/* eslint-disable tsdoc/syntax */
/**
 * This is the documentation for the locales keys in the footer plugin.
 * These locales are *NOT* exported, but documented only.
 *
 * @module locales/plugins/footer
 */
/* eslint-enable tsdoc/syntax */

/**
 * German locales for footer plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesDe = {} as const

/**
 * English locales for footer plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesEn = {} as const

// first type will be used as fallback language
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
