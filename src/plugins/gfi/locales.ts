/* eslint-disable tsdoc/syntax */
/**
 * This is the documentation for the locales keys in the gfi plugin.
 * These locales are *NOT* exported, but documented only.
 *
 * @module locales/plugins/gfi
 */
/* eslint-enable tsdoc/syntax */

import type { Locale } from '@/core'

/**
 * German locales for gfi plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesDe = {
	header: {
		close: 'Informationsfenster schließen',
		field: 'Feld',
		value: 'Wert',
	},
	property: {
		export: 'Export als PDF',
		imageAlt:
			'Bitte entnehmen Sie Informationen zum Inhalt des Bildes aus den umliegenden Tabellenfeldern',
		linkTitle: 'In neuem Tab öffnen',
		linkText: 'Link',
	},
	switch: {
		previous: 'Vorangehender Datensatz',
		next: 'Nächster Datensatz',
	},
	noActiveLayer:
		'Derzeit ist kein Kartenmaterial mit passenden Objekten eingeschaltet.',
	list: {
		header: 'Objektliste',
		entry: 'Eintrag',
		to: 'bis',
		of: 'von',
		emptyView: 'Im aktuellen Kartenausschnitt sind keine Objekte enthalten.',
	},
} as const

/**
 * English locales for gfi plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesEn = {
	header: {
		close: 'Close information window',
		field: 'Field',
		value: 'Value',
	},
	property: {
		export: 'Export as a PDF document',
		imageAlt:
			'Please refer to the other table fields for further information about the topics of the displayed picture',
		linkTitle: 'Open in a new tab',
		linkText: 'Link',
	},
	switch: {
		previous: 'Previous data',
		next: 'Next data',
	},
	noActiveLayer: 'Currently, no map layer with fitting objects is active.',
	list: {
		header: 'Feature list',
		entry: 'Entry',
		to: 'to',
		of: 'of',
		emptyView: 'There are no features in the current view.',
	},
} as const

/**
 * Gfi plugin locales.
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
