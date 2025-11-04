/* eslint-disable tsdoc/syntax */
/**
 * This is the documentation for the locales keys in the addressSearch plugin.
 * These locales are *NOT* exported, but documented only.
 *
 * @module locales/plugins/addressSearch
 */
/* eslint-enable tsdoc/syntax */

import type { Locale } from '@/core'

export const resourcesDe = {} as const

export const resourcesEn = {} as const

// first type will be used as fallback language
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
