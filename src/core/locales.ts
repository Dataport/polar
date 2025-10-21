/* eslint-disable tsdoc/syntax */
/**
 * This is the documentation for the locales keys in POLAR core.
 * These locales are *NOT* exported, but documented only.
 *
 * @module locales/core
 */
/* eslint-enable tsdoc/syntax */

import type { Locale } from './types'

/**
 * German locales for POLAR core.
 * For overwriting these values, pass a partial object of this in `locales`.
 */
export const resourcesDe = {
	canvas: {
		label: 'Kartenanwendung',
	},
	error: {
		serviceUnavailable:
			'Der Kartendienst "{{serviceName}}" (ID: {{serviceId}}) ist derzeit nicht verfügbar. Dies kann die Funktionalität der Karte einschränken.',
	},
	overlay: {
		noControlOnZoom: 'Verwenden Sie Strg+Scrollen zum Zoomen der Karte',
		noCommandOnZoom: 'Verwenden Sie Command ⌘ + Scrollen zum Zoomen der Karte',
		oneFingerPan:
			'Verwenden Sie mindestens zwei Finger zum Verschieben der Karte',
	},
} as const

/**
 * English locales for POLAR core.
 * For overwriting these values, pass a partial object of this in `locales`.
 */
export const resourcesEn = {
	canvas: {
		label: 'Map application',
	},
	error: {
		serviceUnavailable:
			'Service  "{{serviceName}}" (ID: {{serviceId}}) is unavailable. This may limit the map\'s functionality.',
	},
	overlay: {
		noControlOnZoom: 'Use Ctrl+Mousewheel to zoom into the map',
		noCommandOnZoom: 'Use Command ⌘ + Mousewheel to zoom into the map',
		oneFingerPan: 'Use at least two fingers to pan the map',
	},
} as const

/**
 * Core locales.
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
