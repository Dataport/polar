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
        // TODO add addition to changelog when we're there (not doing it now or it slides through with the unpublisheds ...)
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
        routing: 'Routing planner',
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
