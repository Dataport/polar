/* eslint-disable tsdoc/syntax */
/**
 * This is the documentation for the locales keys in the toast plugin.
 * These locales are *NOT* exported, but documented only.
 *
 * @module locales/plugins/toast
 */
/* eslint-enable tsdoc/syntax */

import type { Locale } from '@/core'

/**
 * German locales for toast plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesDe = {
	dismissButton: {
		label: 'Benachrichtigung ausblenden',
	},
} as const

/**
 * English locales for toast plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesEn = {
	dismissButton: {
		label: 'Hide notification',
	},
} as const

/**
 * Toast plugin locales.
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
