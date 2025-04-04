import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
  plugins: {
    mousePosition: {
      selectCrsTooltip: 'Auswahl eines Koordinatenreferenzsystems',
    },
  },
} as const

export const resourcesEn = {
  plugins: {
    mousePosition: {
      selectCrsTooltip: 'Coordinate reference system selection',
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
