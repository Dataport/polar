import type { Locale } from '@/core'

export const resourcesDe = {
	loading: 'Lädt...',
} as const

export const resourcesEn = {
	loading: 'Loading...',
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
