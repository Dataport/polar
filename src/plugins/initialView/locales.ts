/* eslint-disable tsdoc/syntax */
/**
 * @module locales/plugins/returnToInitialView
 */
/* eslint-enable tsdoc/syntax */

import type { Locale } from '@/core'

export const resourcesDe = {
	title: 'Zur Startansicht',
	label: {
		return: 'Zurück zur Startansicht',
	},
} as const

export const resourcesEn = {
	title: 'Return to Start View',
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
