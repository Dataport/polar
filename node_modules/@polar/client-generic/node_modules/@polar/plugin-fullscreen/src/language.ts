import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        fullscreen: {
          button: {
            tooltip: {
              activate: 'Vollbildmodus aktivieren',
              deactivate: 'Vollbildmodus deaktivieren',
            },
          },
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      plugins: {
        fullscreen: {
          button: {
            tooltip: {
              activate: 'Activate fullscreen',
              deactivate: 'Deactivate fullscreen',
            },
          },
        },
      },
    },
  },
]

export default language
