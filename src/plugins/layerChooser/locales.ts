import type { Locale } from '@/core'

export const resourcesDe = {
	backgroundTitle: 'Hintergrundkarten',
	maskTitle: 'Fachdaten',
	layerHeader: 'Auswahl sichtbarer Ebenen für Layer "$t({{name}})"',
	layerOptions: 'Optionen für Kartenmaterial',
	returnToLayers: 'Zurück',
} as const

export const resourcesEn = {
	backgroundTitle: 'Background maps',
	maskTitle: 'Subject data',
	layerHeader: 'Visible layer selection for layer "{{name}}"',
	layerOptions: 'Map data options',
	returnToLayers: 'Back',
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
