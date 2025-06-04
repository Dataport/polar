import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
  plugins: {
    pointerPosition: {
      label: 'Zeigerposition: {{value}}',
      projectionSelect: {
        label: 'Koordinatenreferenzsystem',
      },
    },
  },
} as const

export const resourcesEn = {
  plugins: {
    pointerPosition: {
      label: 'Pointer position: {{value}}',
      projectionSelect: {
        label: 'Coordinate reference system',
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
