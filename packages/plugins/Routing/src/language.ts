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
          startLabel: 'Starting point',
          endLabel: 'Endpoint',
          resetButton: 'Reset',
          modeLabel: 'Travel Mode',
          mode: {
            car: 'Car',
            hdv: 'HeavyDutyVehicle',
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
        },
      },
    },
  },
]

export default language
