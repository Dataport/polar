import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        meldemichel: {
          afmButton: {
            buttonText: 'Neues Anliegen',
            missingAddress:
              'Bitte geben Sie eine Adresse ein oder wählen Sie eine Position durch Klick in die Karte.',
            hint: 'Einen neuen Schaden melden',
          },
        },
      },
    },
  },
]

export default language
