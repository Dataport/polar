import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
  plugins: {
    pointerPosition: {
      label: 'Zeigerposition in {{epsg}}',
      projectionSelect: {
        ariaLabel: 'Auswahl des Koordinatenreferenzsystems',
      },
    },
  },
} as const

export const resourcesEn = {
  plugins: {
    pointerPosition: {
      label: 'Pointer position in {{epsg}}',
      projectionSelect: {
        ariaLabel: 'Coordinate reference system selection',
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
