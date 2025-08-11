import type { Locale } from '@/core'

export const resourcesDe = {
	button: {
		label: 'Vollbildmodus',
		label_off: 'Vollbildmodus deaktivieren',
		label_on: 'Vollbildmodus aktivieren',
	},
}

export const resourcesEn = {
	button: {
		label: 'Fullscreen mode',
		label_off: 'Disable fullscreen mode',
		label_on: 'Enable fullscreen mode',
	},
}

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
