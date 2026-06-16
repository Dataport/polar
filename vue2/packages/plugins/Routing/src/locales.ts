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
			avoidRoutesTitle: 'Verkehrswege meiden',
			avoidRoutes: {
				highways: 'Autobahnen',
				tollways: 'Mautstraßen',
				ferries: 'Fähren',
			},
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
			avoidRoutesTitle: 'Types of routes to avoid',
			avoidRoutes: {
				highways: 'Highways',
				tollways: 'Tollways',
				ferries: 'Ferries',
			},
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
