import { LanguageOption } from '@polar/lib-custom-types'

const lang: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        dish: {
          exportPDF: {
            userInfo:
              'Bitte wählen Sie ein Denkmalobjekt über Klicken in der Karte aus.',
            buttonPrint: 'Karte drucken',
            buttonCancel: 'Abbrechen',
            tooltip: 'Kartendruck PDF',
          },
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      plugins: {
        dish: {
          exportPDF: {
            userInfo: 'Please select a monument object by clicking on the map.',
            buttonPrint: 'Print map',
            buttonCancel: 'cancel',
            tooltip: 'Map Export PDF',
          },
        },
      },
    },
  },
]

export default lang
