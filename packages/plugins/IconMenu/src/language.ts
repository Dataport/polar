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
            measure: 'Entfernung messen',
            filter: 'Filter',
            layerChooser: 'Kartenauswahl',
            gfi: 'Objektliste',
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
            measure: 'Measure distance',
            filter: 'Filter',
            layerChooser: 'Choose map',
            gfi: 'Feature list',
          },
        },
      },
    },
  },
]

export default language
