import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        routing: {
          title: 'Routenplaner',
          button: {
            closeTitle: 'Routenplanung schließen',
            openTitle: 'Routenplanung öffnen',
          },
          startLabel: 'Startadresse',
          endLabel: 'Zieladresse',
          inputHint:
            'Wählen Sie durch Klicken einen Punkt auf der Karte aus oder geben Sie eine Adresse ein.',
          resetButton: 'Zurücksetzen',
          modeLabel: 'Fortbewegungsart',
          travelMode: {
            car: 'Auto',
            hgv: 'LKW',
            bike: 'Fahrrad',
            walking: 'Zu Fuß',
            wheelchair: 'Rollstuhl',
          },
          preferenceLabel: 'Bevorzugte Route',
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
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      plugins: {
        routing: {
          title: 'Route Planner',
          button: {
            closeTitle: 'Hide routing tool',
            openTitle: 'Show rooting tool',
          },
          startLabel: 'Start Address',
          endLabel: 'Destination Address',
          inputHint: 'Click the map to choose a point or enter an Ad',
          resetButton: 'Reset',
          modeLabel: 'Travel Mode',
          travelMode: {
            car: 'Car',
            hgv: 'Heavy Goods Vehicle',
            bike: 'Bike',
            walking: 'Walking',
            wheelchair: 'Wheelchair',
          },
          preferenceLabel: 'Preferred Route',
          preference: {
            recommended: 'Recommended',
            fastest: 'Fastest',
            shortest: 'Shortest',
          },
          avoidRoutesTitle: 'Types of routes to avoid',
          avoidRoutes: {
            highways: 'highways',
            tollways: 'tollways',
            ferries: 'ferries',
          },
          sendRequestButton: 'Send',
          toolTip:
            'Required: Start Address, Destination Address, Travel Mode and Preferred Route.',
          routeDetails: 'Route Details',
        },
      },
    },
  },
]

export default language
