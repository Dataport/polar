import type { Locale } from '@/core'

export const resourcesDe = {
	mobileCloseButton: '{{plugin}} schließen',
	hints: {
		attributions: 'Quellennachweis',
		draw: 'Zeichenwerkzeuge',
		filter: 'Filter',
		layerChooser: 'Kartenauswahl',
		gfi: 'Objektliste',
	},
} as const

export const resourcesEn = {
	mobileCloseButton: 'Close {{plugin}}',
	hints: {
		attributions: 'Attributions',
		draw: 'Draw tools',
		filter: 'Filter',
		layerChooser: 'Choose map',
		gfi: 'Feature list',
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
