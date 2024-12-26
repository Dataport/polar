import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        scale: {
          toOneNegative: 'Skalierung muss eine positive Zahl sein',
          label: 'Skala',
          scaleSwitcher: 'Maßstab ändern',
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
          scaleSwitcher: 'Change scale',
        },
      },
    },
  },
]

export default language
