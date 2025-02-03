import { Locale } from '@polar/lib-custom-types'

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

const locales: Locale[] = [
  {
    type: 'de',
    resources: resourcesDe,
  },
  {
    type: 'en',
    resources: resourcesEn,
  },
]

export default locales
