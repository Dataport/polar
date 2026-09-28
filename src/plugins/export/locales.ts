import type { Locale } from '@/core'

/* eslint-disable tsdoc/syntax */
/**
 * This is the documentation for the locales keys in the export plugin.
 * These locales are *NOT* exported, but documented only.
 *
 * @module locales/plugins/export
 */
/* eslint-enable tsdoc/syntax */

/**
 * German locales for export plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesDe = {
	button: {
		tooltip: {
			open: 'Kartenexportoptionen öffnen',
			close: 'Kartenexportoptionen schließen',
			format: 'Karte als {{format}} exportieren',
		},
	},
	error: 'Beim Exportieren der Karte ist ein Fehler aufgetreten.',
} as const

/**
 * English locales for export plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesEn = {
	button: {
		tooltip: {
			open: 'Open map export options',
			close: 'Close map export options',
			format: 'Export map as {{format}}',
		},
	},
	error: 'An error occurred while exporting the map.',
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
