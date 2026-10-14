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
		empty: 'Bitte einen Suchbegriff eingeben oder in die Karte klicken.',
		error: 'Etwas ist bei der Suche schiefgegangen.',
		noResults: 'Keine Ergebnisse gefunden.',
		loading: 'Suche ...',
		tooShort: 'Für die Suche bitte mindestens {{minLength}} Zeichen eingeben.',
	},
	aria: {
		ariaLive: `Route berechnet: {{steps}} Schritte, {{duration}}, {{distance}}.`,
		instructionWithSearch:
			'Durch Klicken in die Karte oder durch Eingabe und Auswahl eines Suchbegriffs einen Ort hinzufügen.',
		instructionWithoutSearch:
			'Durch Klicken in die Karte einen Ort hinzufügen.',
	},
	clear: '{{label}} Eingabefeld leeren',
	distance: 'Entfernung: {{distance}}',
	duration: 'Dauer: {{duration}}',
	noFeature:
		'Die Route konnte nicht ermittelt werden. Versuchen Sie es mit anderen Koordinaten.',
} as const

export const resourcesEn = {
	title: 'Route Planner',
	label: {
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
		empty: 'Please enter a search term or click on the map.',
		error: 'Something went wrong.',
		noResults: 'No results found.',
		loading: 'Searching...',
		tooShort: 'Please enter at least {{minLength}} characters.',
	},
	aria: {
		ariaLive: `Route calculated: {{steps}} steps, {{duration}}, {{distance}}.`,
		instructionWithSearch:
			'Add a location by clicking on the map or by entering and selecting a search term.',
		instructionWithoutSearch: 'Add a location by clicking on the map.',
	},
	clear: 'Clear {{label}} input field',
	distance: 'Distance: {{distance}}',
	duration: 'Duration: {{duration}}',
	noFeature: 'Route could not be determined. Try different coordinates.',
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
