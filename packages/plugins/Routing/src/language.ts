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
          resetButton: 'Zurücksetzen',
          modeLabel: 'Fortbewegungsmittel',
          travelMode: {
            car: 'Auto',
            hdv: 'LKW',
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
          resetButton: 'Reset',
          modeLabel: 'Travel Mode',
          travelMode: {
            car: 'Car',
            hdv: 'Heavy Duty Vehicle',
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
        },
      },
    },
  },
]

export default language
