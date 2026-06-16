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
		start: 'Startadresse',
		middle: 'Wegpunkt',
		end: 'Zieladresse',
		add: 'Wegpunkt hinzufügen',
		remove: 'Wegpunkt entfernen',
		travelMode: 'Fortbewegungsart',
		preference: 'Bevorzugte Route',
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
} as const

export const resourcesEn = {
	title: 'Route Planner',
	label: {
		aria: 'Add a coordinate as {{position}} by clicking in the map.',
		start: 'Start Address',
		middle: 'Waypoint',
		end: 'Destination Address',
		add: 'Add waypoint',
		remove: 'Remove waypoint',
		travelMode: 'Travel Mode',
		preference: 'Preferred Route',
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
