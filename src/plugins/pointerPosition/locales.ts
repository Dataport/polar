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
	label: 'Zeigerposition',
	projectionSelect: {
		label: 'Koordinatenreferenzsystem',
	},
} as const

/**
 * English locales for pointerPosition plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesEn = {
	label: 'Pointer position',
	projectionSelect: {
		label: 'Coordinate reference system',
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
