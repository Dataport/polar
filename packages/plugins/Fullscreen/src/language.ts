import { LanguageOption } from '@polar/lib-custom-types'

export const resourcesDe = {
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
} as const

export const resourcesEn = {
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
} as const

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: resourcesDe,
  },
  {
    type: 'en',
    resources: resourcesEn,
  },
]

export default language
