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
        routing: 'Routenplaner',
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
        routing: 'Routing Planner',
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
