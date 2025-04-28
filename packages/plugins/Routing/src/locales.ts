import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
  plugins: {
    routing: {
      title: 'Routenplaner',
      button: {
        closeTitle: 'Routenplanung schließen',
        openTitle: 'Routenplanung öffnen',
      },
      label: {
        start: 'Startadresse',
        middle: 'Wegpunkt',
        end: 'Zieladresse',
        mode: 'Fortbewegungsart',
        preference: 'Bevorzugte Route',
      },
      inputHint:
        'Wählen Sie durch Klicken einen Punkt auf der Karte aus oder geben Sie eine Adresse ein.',
      resetButton: 'Zurücksetzen',
      travelMode: {
        car: 'Auto',
        hgv: 'LKW',
        bike: 'Fahrrad',
        walking: 'Zu Fuß',
        wheelchair: 'Rollstuhl',
      },
      preference: {
        recommended: 'Empfohlene',
        fastest: 'Schnellste',
        shortest: 'Kürzeste',
      },
      avoidRoutesTitle: 'Verkehrswege meiden',
      avoidRoutes: {
        highways: 'Autobahnen',
        tollways: 'Mautstraßen',
        ferries: 'Fähren',
      },
      sendRequestButton: 'Absenden',
      toolTip:
        'Pflichtfelder: Startadresse, Zieladresse, Fortbewegungsart und bevorzugte Route.',
      routeDetails: 'Details zur Route',
      distance: 'Entfernung:',
      duration: 'Dauer:',
    },
  },
}

export const resourcesEn = {
  plugins: {
    routing: {
      title: 'Route Planner',
      button: {
        closeTitle: 'Hide routing tool',
        openTitle: 'Show rooting tool',
      },
      label: {
        start: 'Start Address',
        middle: 'Waypoint',
        end: 'Destination Address',
        mode: 'Travel Mode',
        preference: 'Preferred Route',
      },
      inputHint: 'Click the map to choose a point or enter an Ad',
      resetButton: 'Reset',
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
      avoidRoutesTitle: 'Types of routes to avoid',
      avoidRoutes: {
        highways: 'Highways',
        tollways: 'Tollways',
        ferries: 'Ferries',
      },
      sendRequestButton: 'Send',
      toolTip:
        'Required: Start Address, Destination Address, Travel Mode and Preferred Route.',
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
