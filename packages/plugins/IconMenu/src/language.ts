import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
  plugins: {
    iconMenu: {
      mobileCloseButton: '{{plugin}} schließen',
      hints: {
        attributions: 'Quellennachweis',
        draw: 'Zeichenwerkzeuge',
        filter: 'Filter',
        layerChooser: 'Kartenauswahl',
        gfi: 'Objektliste',
      },
    },
  },
} as const

export const resourcesEn = {
  plugins: {
    iconMenu: {
      mobileCloseButton: 'Close {{plugin}}',
      hints: {
        attributions: 'Attributions',
        draw: 'Draw tools',
        filter: 'Filter',
        layerChooser: 'Choose map',
        gfi: 'Feature list',
      },
    },
  },
} as const

const language: Locale[] = [
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
