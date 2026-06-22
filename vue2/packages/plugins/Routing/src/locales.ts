import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
	plugins: {
		routing: {
			inputHint:
				'Wählen Sie durch Klicken einen Punkt auf der Karte aus oder geben Sie eine Adresse ein.',
			distance: 'Entfernung:',
			duration: 'Dauer:',
		},
	},
}

export const resourcesEn = {
	plugins: {
		routing: {
			inputHint: 'Click the map to choose a point or enter an Ad',
			distance: 'Distance:',
			duration: 'Duration:',
		},
	},
}

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
