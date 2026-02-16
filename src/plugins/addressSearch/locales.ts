/* eslint-disable tsdoc/syntax */
/**
 * This is the documentation for the locales keys in the addressSearch plugin.
 * These locales are *NOT* exported, but documented only.
 *
 * @module locales/plugins/addressSearch
 */
/* eslint-enable tsdoc/syntax */

import type { Locale } from '@/core'

import { PluginId } from './types'

export const resourcesDe = {
	aria: {
		description:
			'Durch Eingabe in das Suchfeld kann die Suche nach Adressen gestartet werden',
	},
	defaultLabel: 'Adresssuche',
	hint: {
		button: 'Eingabefeld der Addresssuche anzeigen',
		clear: 'Das Eingabefeld der Addresssuche leeren',
		error: 'Etwas ist bei der Suche schiefgegangen.',
		loading: 'Suche ...',
		noResults: 'Keine Ergebnisse gefunden.',
		tooShort: 'Für die Suche bitte mindestens {{minLength}} Zeichen eingeben.',
	},
	groupSelector: 'Suchthema auswählen',
	resultCount: '({{count}} Ergebnisse)',
	resultList: {
		extend: 'Alle Ergebnisse anzeigen',
		reduce: 'Ergebnisliste reduzieren',
	},
} as const

export const resourcesEn = {
	aria: {
		description:
			'By entering text into the search field, the address search can be started',
	},
	defaultLabel: 'Address Search',
	hint: {
		button: 'Show address search input field',
		clear: 'Clear address search input field',
		error: 'Something went wrong.',
		loading: 'Searching ...',
		noResults: 'No results for the current query.',
		tooShort: 'Please enter at least {{minLength}} characters.',
	},
	groupSelector: 'Select search topic',
	resultCount: '({{count}} results)',
	resultList: {
		extend: 'Show all results',
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
