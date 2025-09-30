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
export const resourcesDe = {
	boundaryError:
		'Die Überprüfung der Koordinate ist fehlgeschlagen. Bitte versuchen Sie es später erneut oder wenden Sie sich an einen Administrator, wenn das Problem bestehen bleibt.',
	notInBoundary: 'Diese Koordinate kann nicht gewählt werden.',
} as const

/**
 * English locales for pins plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesEn = {
	boundaryError:
		'Validating the coordinate failed. Please try again later or contact an administrator if the issue persists.',
	notInBoundary: 'It is not possible to select this coordinate.',
} as const

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
