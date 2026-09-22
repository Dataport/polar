/* eslint-disable tsdoc/syntax */
/**
 * @module locales/plugins/InitialView
 */
/* eslint-enable tsdoc/syntax */

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
