import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
  diplan: {
    gfi: {
      headerLabelLayer_one: '{{ count }} Layer',
      headerLabelLayer_other: '{{ count }} Layer',
      headerLabelWmsFeature_one: '{{ count }} WMS-Feature',
      headerLabelWmsFeature_other: '{{ count }} WMS-Features',
      hintInfoWmsFeatures:
        'Die Anzahl der aufgeführten WMS-Features ist abhängig vom Klick-Radius und der Zoomstufe.',
      zeroAttributes: 'Keine Attribute vorhanden!',
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
