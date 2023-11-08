import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        toast: {
          close: 'Benachrichtigung ausblenden',
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      plugins: {
        toast: {
          close: 'Hide notification',
        },
      },
    },
  },
]

export default language
