import { Locale } from '@polar/lib-custom-types'

export const dishExportMapDe = {
  exportPDF: {
    userInfo:
      'Bitte wählen Sie ein Denkmalobjekt über Klicken in der Karte aus.',
    buttonPrint: 'Karte drucken',
    buttonCancel: 'Abbrechen',
    tooltip: 'Kartendruck PDF',
  },
} as const

export const dishExportMapEn = {
  exportPDF: {
    userInfo: 'Please select a monument object by clicking on the map.',
    buttonPrint: 'Print map',
    buttonCancel: 'cancel',
    tooltip: 'Map Export PDF',
  },
} as const

const locales: Locale[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        dish: {
          ...dishExportMapDe,
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      plugins: {
        dish: {
          ...dishExportMapEn,
        },
      },
    },
  },
]

export default locales
