/* eslint-disable tsdoc/syntax */
/**
 * This is the documentation for the locales keys in the geoLocation plugin.
 * These locales are *NOT* exported, but documented only.
 *
 * @module locales/plugins/geoLocation
 */
/* eslint-enable tsdoc/syntax */

import type { Locale } from '@/core'

/**
 * German locales for geoLocation plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesDe = {
	markerText: 'Aktuelle Position',
	button: {
		locationAccessDenied: 'Standortzugriff nutzerseitig abgelehnt',
		tooltip: 'Eigene Position markieren',
	},
	toast: {
		boundaryError:
			'Die Überprüfung Ihrer Position ist fehlgeschlagen. Bitte versuchen Sie es später erneut oder wenden Sie sich an einen Administrator, wenn das Problem bestehen bleibt.',
		notInBoundary: 'Sie befinden sich nicht im Kartengebiet.',
	},
} as const

/**
 * English locales for geoLocation plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesEn = {
	markerText: 'Current location',
	button: {
		locationAccessDenied: 'Location access denied by user',
		tooltip: 'Mark own location',
	},
	toast: {
		boundaryError:
			'Validating your position failed. Please try later again or contact an administrator if the issue persists.',
		notInBoundary: "You are not within the map's boundaries.",
	},
} as const

/**
 * GeoLocation plugin locales.
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
