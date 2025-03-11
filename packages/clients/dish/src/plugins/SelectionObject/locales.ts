import { Locale } from '@polar/lib-custom-types'

export const dishSelectionMapDe = {
  selectionObject: {
    visibility: 'Sichtbarkeit des Auswahlobjekts einstellen.',
  },
} as const

export const dishSelectionMapEn = {
  selectionObject: {
    visibility: 'Toggle visibility of selection object.',
  },
} as const

const locales: Locale[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        dish: {
          ...dishSelectionMapDe,
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      plugins: {
        dish: {
          ...dishSelectionMapEn,
        },
      },
    },
  },
]

export default locales
