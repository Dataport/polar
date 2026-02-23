/* eslint-disable tsdoc/syntax */
/**
 * This is the documentation for the locales keys for POLAR shared components.
 * These locales are *NOT* exported, but documented only.
 *
 * @module locales/shared
 */
/* eslint-enable tsdoc/syntax */

import type { Locale } from '@/core/types'

/**
 * German locales for POLAR core.
 * For overwriting these values, pass a partial object of this in `locales`.
 */
export const resourcesDe = {
	pagination: {
		currentPage: 'Aktuelle Seite, Seite {{page}}',
		page: 'Seite {{page}}',
		next: 'Nächste Seite',
		previous: 'Vorherige Seite',
		wrapper: 'Seitenauswahl',
	},
} as const

/**
 * English locales for POLAR core.
 * For overwriting these values, pass a partial object of this in `locales`.
 */
export const resourcesEn = {
	pagination: {
		currentPage: 'Aktuelle Seite, Seite {{page}}',
		page: 'Seite {{page}}',
		next: 'Nächste Seite',
		previous: 'Vorherige Seite',
		wrapper: 'Seitenauswahl',
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
