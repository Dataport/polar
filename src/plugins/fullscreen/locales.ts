/* eslint-disable tsdoc/syntax */
/**
 * This is the documentation for the locales keys in the fullscreen plugin.
 * These locales are *NOT* exported, but documented only.
 *
 * @module locales/plugins/fullscreen
 */
/* eslint-enable tsdoc/syntax */

import type { Locale } from '@/core'

/**
 * German locales for fullscreen plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesDe = {
	button: {
		label: 'Vollbildmodus',
		label_off: 'Vollbildmodus deaktivieren',
		label_on: 'Vollbildmodus aktivieren',
	},
} as const

/**
 * English locales for fullscreen plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesEn = {
	button: {
		label: 'Fullscreen mode',
		label_off: 'Disable fullscreen mode',
		label_on: 'Enable fullscreen mode',
	},
} as const

/**
 * Fullscreen plugin locales.
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
