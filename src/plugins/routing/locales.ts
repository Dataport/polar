/* eslint-disable tsdoc/syntax */
/**
 * This is the documentation for the locales keys in the routing plugin.
 * These locales are *NOT* exported, but documented only.
 *
 * @module locales/plugins/routing
 */
/* eslint-enable tsdoc/syntax */

import type { Locale } from '@/core'

export const resourcesDe = {
	title: 'Routenplaner',
	label: {
		aria: 'Durch Klicken in die Karte eine Koordinate als {{position}} auswählen.',
		start: 'Start',
		middle: 'Wegpunkt',
		end: 'Ziel',
		add: 'Wegpunkt hinzufügen',
		remove: 'Wegpunkt entfernen',
		travelMode: 'Fortbewegungsart',
		preference: 'Bevorzugte Route',
		avoid: 'Verkehrswege meiden',
		reset: 'Zurücksetzen',
		details: 'Details zur Route',
		steps: 'Routenanweisungen',
	},
	travelMode: {
		car: 'Auto',
		hgv: 'LKW',
		bike: 'Fahrrad',
		walking: 'Zu Fuß',
		wheelchair: 'Rollstuhl',
	},
	preference: {
		recommended: 'Empfohlen',
		fastest: 'Schnellste',
		shortest: 'Kürzeste',
	},
	avoid: {
		highways: 'Autobahnen',
		tollways: 'Mautstraßen',
		ferries: 'Fähren',
	},
	hint: {
		error: 'Etwas ist bei der Suche schiefgegangen.',
		noResults: 'Keine Ergebnisse gefunden.',
	},
	ariaLive: `Route berechnet: {{steps}} Schritte, {{duration}}, {{distance}}.`,
	ariaDescription:
		'Durch Eingabe in das Suchfeld kann die Suche nach Adressen gestartet werden',
	clear: '{{label}} Eingabefeld leeren',
	distance: 'Entfernung: {{distance}}',
	duration: 'Dauer: {{duration}}',
	noFeature:
		'Die Route konnte nicht ermittelt werden. Versuchen Sie es mit anderen Koordinaten.',
	resultList: {
		extend: 'Alle Ergebnisse anzeigen',
		reduce: 'Ergebnisse reduzieren',
	},
	resultCount: '({{count}} Ergebnisse)',
} as const

export const resourcesEn = {
	title: 'Route Planner',
	label: {
		aria: 'Add a coordinate as {{position}} by clicking in the map.',
		start: 'Start',
		middle: 'Waypoint',
		end: 'Destination',
		add: 'Add waypoint',
		remove: 'Remove waypoint',
		travelMode: 'Travel Mode',
		preference: 'Preferred Route',
		avoid: 'Types of routes to avoid',
		reset: 'Reset',
		details: 'Route Details',
		steps: 'Route instructions',
	},
	travelMode: {
		car: 'Car',
		hgv: 'Heavy Goods Vehicle',
		bike: 'Bike',
		walking: 'Walking',
		wheelchair: 'Wheelchair',
	},
	preference: {
		recommended: 'Recommended',
		fastest: 'Fastest',
		shortest: 'Shortest',
	},
	avoid: {
		highways: 'Highways',
		tollways: 'Tollways',
		ferries: 'Ferries',
	},
	hint: {
		error: 'Something went wrong.',
		noResults: 'No results found.',
	},
	ariaLive: `Route calculated: {{steps}} steps, {{duration}}, {{distance}}.`,
	ariaDescription:
		'By entering text into the search field, the address search can be started',
	clear: 'Clear {{label}} input field',
	distance: 'Distance: {{distance}}',
	duration: 'Duration: {{duration}}',
	noFeature: 'Route could not be determined. Try different coordinates.',
	resultList: {
		extend: 'Show all results',
		reduce: 'Reduce result list',
	},
	resultCount: '({{count}} results)',
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
