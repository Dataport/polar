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
            layerChooser: 'Kartenauswahl',
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
            layerChooser: 'Choose map',
          },
        },
      },
    },
  },
]

export default language
