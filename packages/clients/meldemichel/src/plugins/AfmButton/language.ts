import { LanguageOption } from '@polar/lib-custom-types'

export const meldemichelDe = {
  afmButton: {
    buttonText: 'Neues Anliegen',
    missingAddress:
      'Bitte geben Sie eine Adresse ein oder wählen Sie eine Position durch Klick in die Karte.',
    hint: 'Einen neuen Schaden melden',
  },
} as const

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        meldemichel: {
          ...meldemichelDe,
        },
      },
    },
  },
]

export default language
