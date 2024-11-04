import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        iconMenu: {
          mobileCloseButton: '{{plugin}} schließen',
          hints: {
            attributions: 'Quellennachweis',
            draw: 'Zeichenwerkzeuge',
            filter: 'Filter',
            layerChooser: 'Kartenauswahl',
            gfi: 'Objektliste',
            routing: 'Routenplaner',
          },
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      plugins: {
        iconMenu: {
          mobileCloseButton: 'Close {{plugin}}',
          hints: {
            attributions: 'Attributions',
            draw: 'Draw tools',
            filter: 'Filter',
            layerChooser: 'Choose map',
            gfi: 'Feature list',
            routing: 'Route Planner',
          },
        },
      },
    },
  },
]

export default language
