import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        iconMenu: {
          hints: {
            attributions: 'Quellennachweis',
            draw: 'Zeichenwerkzeuge',
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
          hints: {
            attributions: 'Attributions',
            draw: 'Draw tools',
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
