import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
  diplan: {
    gfi: {
      // TODO reduce to set of required ones
      error: 'Konfigurationsfehler, gfiThemeSettings unvollständig',
      noLayer: 'GFI-Layer nicht aktiv',
      // TODO our framework knows pluralization, use it
      headerLabelLayers: 'Layer(s)',
      // TODO our framework knows pluralization, use it
      headerLabelWmsFeatures: 'WMS Features',
      hintInfoWmsFeatures:
        'Die Anzahl der aufgeführten WMS Features ist abhängig vom Klick-Radius und der Zoomstufe.',
      buttonTextMore: 'Mehr anzeigen',
      buttonTextLess: 'Weniger anzeigen',
      link: 'Link',
    },
  },
} as const

const locales: Locale[] = [
  {
    type: 'de',
    resources: resourcesDe,
  },
]

export default locales
