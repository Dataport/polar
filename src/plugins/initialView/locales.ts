/**
 * @module locales/plugins/InitialView
 */

import type { Locale } from '@/core'

export const resourcesDe = {
	label: {
		return: 'Zurück zur Startansicht',
	},
} as const

export const resourcesEn = {
	label: {
		return: 'Return to start view',
	},
} as const

/**
 * InitialView plugin locales.
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

/** @internal */
export default locales
