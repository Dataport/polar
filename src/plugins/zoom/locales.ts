/* eslint-disable tsdoc/syntax */
/**
 * This is the documentation for the locales keys in the zoom plugin.
 * These locales are *NOT* exported, but documented only.
 *
 * @module locales/plugins/zoom
 */
/* eslint-enable tsdoc/syntax */

import type { Locale } from '@/core'

/**
 * German locales for zoom plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesDe = {
	zoomIn: 'Reinzoomen',
	zoomOut: 'Rauszoomen',
	slider: 'Zoomstufe anpassen',
} as const

/**
 * English locales for zoom plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesEn = {
	zoomIn: 'Zoom in',
	zoomOut: 'Zoom out',
	slider: 'Change zoom level',
} as const

/**
 * Zoom plugin locales.
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
