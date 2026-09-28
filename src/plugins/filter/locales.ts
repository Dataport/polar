/* eslint-disable tsdoc/syntax */
/**
 * This is the documentation for the locales keys in the filter plugin.
 * These locales are *NOT* exported, but documented only.
 *
 * @module locales/plugins/filter
 */
/* eslint-enable tsdoc/syntax */

import type { Locale } from '@/core'

/**
 * German locales for filter plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesDe = {
	category: {
		deselectAll: 'Alle an-/abwählen',
	},
	time: {
		header: 'Zeitraum',
		noRestriction: 'Keine Einschränkung',
		last_zero: 'Heute',
		last_one: 'Der letzte Tag',
		last_other: 'Die letzten {{count}} Tage',
		next_zero: 'Heute',
		next_one: 'Der nächste Tag',
		next_other: 'Die nächsten {{count}} Tage',
		chooseTimeFrame: 'Zeitraum wählen',
	},
} as const

/**
 * English locales for filter plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesEn = {
	category: {
		deselectAll: 'De-/select all',
	},
	time: {
		header: 'Time frame',
		noRestriction: 'No restriction',
		last_zero: 'Today',
		last_one: 'The last day',
		last_other: 'The last {{count}} days',
		next_zero: 'Today',
		next_one: 'The next day',
		next_other: 'The next {{count}} days',
		chooseTimeFrame: 'Choose time frame',
	},
} as const

/**
 * Filter plugin locales.
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
