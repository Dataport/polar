import type { Locale } from '@/core'

/* eslint-disable tsdoc/syntax */
/**
 * This is the documentation for the locales keys in the export plugin.
 * These locales are *NOT* exported, but documented only.
 *
 * @module locales/plugins/export
 */
/* eslint-enable tsdoc/syntax */

/**
 * German locales for export plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesDe = {
	button: {
		tooltip: 'Karte exportieren',
	},
} as const

/**
 * English locales for export plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesEn = {
	button: {
		tooltip: 'Export map',
	},
} as const

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
