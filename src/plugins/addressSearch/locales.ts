/* eslint-disable tsdoc/syntax */
/**
 * This is the documentation for the locales keys in the addressSearch plugin.
 * These locales are *NOT* exported, but documented only.
 *
 * @module locales/plugins/addressSearch
 */
/* eslint-enable tsdoc/syntax */

import type { Locale } from '@/core'

export const resourcesDe = {
	ariaDescription:
		'Durch Eingabe in das Suchfeld kann die Suche nach Adressen gestartet werden',
	defaultCategory: 'Adresssuche',
	hint: {
		button: 'Eingabefeld der Addresssuche anzeigen',
		clear: 'Das Eingabefeld der Addresssuche leeren',
		error: 'Etwas ist bei der Suche schiefgegangen.',
		loading: 'Suche ...',
		noResults: 'Keine Ergebnisse gefunden.',
		tooShort: 'Für die Suche bitte mindestens {{minLength}} Zeichen eingeben.',
	},
	resultCount: '({{count}} Ergebnisse)',
	resultList: {
		extend: 'Alle Ergebnisse anzeigen',
		extendMax:
			'Alle Ergebnisse (max. {{queryParameters.maxFeatures}}) anzeigen',
		reduce: 'Ergebnisliste reduzieren',
	},
} as const

export const resourcesEn = {
	ariaDescription:
		'Durch Eingabe in das Suchfeld kann die Suche nach Adressen gestartet werden',
	defaultCategory: 'Address Search',
	hint: {
		button: 'Show address search input field',
		clear: 'Clear address search input field',
		error: 'Something went wrong.',
		loading: 'Searching ...',
		noResults: 'No results for the current query.',
		tooShort: 'Please enter at least {{minLength}} characters.',
	},
	resultCount: '({{count}} results)',
	resultList: {
		extend: 'Show all results',
		extendMax: 'Show all results (max. {{queryParameters.maxFeatures}})',
		reduce: 'Reduce result list',
	},
} as const

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
