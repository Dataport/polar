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
          selectModeLabel: 'Fortbewegungsmittel',
          selectModeitems: ['Auto', 'LKW', 'Fahrrad', 'Zu Fuß', 'Rollstuhl'],
          selectPreferenceLabel: 'Bevorzugte Route',
          selectPreferenceItems: ['Empfohlene, Schnellste, Kürzeste'],
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
          selectModeLabel: 'Travel Mode',
          selectModeItems: ['Car', 'Truck', 'Bike', 'Walking', 'Wheelchair'],
          selectPreferenceLabel: 'Preferred Route',
          selectPreferenceItems: ['Recommended, Fastest, Shortest'],
          avoidRoutesTitle: 'Types of routes to avoid',
        },
      },
    },
  },
]

export default language
