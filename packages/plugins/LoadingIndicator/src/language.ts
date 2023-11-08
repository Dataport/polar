import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        loadingIndicator: {
          loading: 'Lädt...',
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      plugins: {
        loadingIndicator: {
          loading: 'Loading...',
        },
      },
    },
  },
]

export default language
