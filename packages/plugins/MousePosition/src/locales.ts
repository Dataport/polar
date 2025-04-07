import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
  plugins: {
    mousePosition: {
      label: 'Mausposition in {{epsg}}',
      projectionSelect: {
        ariaLabel: 'Auswahl des Koordinatenreferenzsystems',
      },
    },
  },
} as const

export const resourcesEn = {
  plugins: {
    mousePosition: {
      label: 'Mouse position in {{epsg}}',
      projectionSelect: {
        ariaLabel: 'Auswahl des Koordinatenreferenzsystems',
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
