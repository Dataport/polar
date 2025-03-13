import { Locale } from '@polar/lib-custom-types'

export const dishSelectionMapDe = {
  selectionObject: {
    visibility: 'Sichtbarkeit des Auswahlobjekts einstellen.',
    object: 'Auswahlobjekt',
  },
} as const

export const dishSelectionMapEn = {
  selectionObject: {
    visibility: 'Toggle visibility of selection object.',
    object: 'Selected object',
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
