/* eslint-disable tsdoc/syntax */
/**
 * This is the documentation for the locales keys in the pointerPosition plugin.
 * These locales are *NOT* exported, but documented only.
 *
 * @module locales/plugins/pointerPosition
 */
/* eslint-enable tsdoc/syntax */

import type { Locale } from '@/core'

/**
 * German locales for pointerPosition plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesDe = {
	contextMenu: 'Position kopieren',
	label: 'Zeigerposition',
	projectionSelect: {
		label: 'Koordinatenreferenzsystem',
	},
	toast: {
		success: 'Position in Zwischenablage kopiert.',
		error: 'Position konnte nicht kopiert werden.',
	},
} as const

/**
 * English locales for pointerPosition plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesEn = {
	contextMenu: 'Copy position',
	label: 'Pointer position',
	projectionSelect: {
		label: 'Coordinate reference system',
	},
	toast: {
		success: 'Position copied to clipboard.',
		error: 'Position could not be copied.',
	},
} as const

/**
 * PointerPositionplugin locales.
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
