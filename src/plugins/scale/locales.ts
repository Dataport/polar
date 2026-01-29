/* eslint-disable tsdoc/syntax */
/**
 * This is the documentation for the locales keys in the scale plugin.
 * These locales are *NOT* exported, but documented only.
 *
 * @module locales/plugins/scale
 */
/* eslint-enable tsdoc/syntax */

import type { Locale } from '@/core'

/**
 * German locales for scale plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesDe = {
	label: 'Skala',
	scaleSwitcher: 'Maßstab ändern',
	to: 'Eins zu {{number}}',
} as const

/**
 * English locales for scale plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesEn = {
	label: 'Scale',
	scaleSwitcher: 'Change scale',
	to: 'One to {{number}}',
} as const

/**
 * Scale plugin locales.
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
