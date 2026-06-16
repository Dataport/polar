import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
	plugins: {
		routing: {
			button: {
				closeTitle: 'Routenplanung schließen',
				openTitle: 'Routenplanung öffnen',
			},
			inputHint:
				'Wählen Sie durch Klicken einen Punkt auf der Karte aus oder geben Sie eine Adresse ein.',
			resetButton: 'Zurücksetzen',
			sendRequestButton: 'Absenden',
			routeDetails: 'Details zur Route',
			distance: 'Entfernung:',
			duration: 'Dauer:',
		},
	},
}

export const resourcesEn = {
	plugins: {
		routing: {
			button: {
				closeTitle: 'Hide routing tool',
				openTitle: 'Show rooting tool',
			},
			inputHint: 'Click the map to choose a point or enter an Ad',
			resetButton: 'Reset',
			sendRequestButton: 'Send',
			routeDetails: 'Route Details',
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
