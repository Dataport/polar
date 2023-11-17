import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        meldemichelAfmButton: {
          buttonText: 'Neues Anliegen',
          missingAddress:
            'Bitte geben Sie eine Adresse ein oder wählen Sie eine Position durch Klick in die Karte.',
        },
      },
    },
  },
]

export default language
