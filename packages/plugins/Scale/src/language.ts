import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        scale: {
          toOneNegative: 'Skalierung muss eine positive Zahl sein',
          label: 'Skala',
          scaleSwitcher: 'Maßstab wählen',
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      plugins: {
        scale: {
          toOneNegative: 'scale must be a positive number',
          label: 'Scale',
          scaleSwitcher: 'choose scale',
        },
      },
    },
  },
]

export default language
