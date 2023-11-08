import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        attributions: {
          button: {
            closeTitle: 'Quellennachweis ausblenden',
            openTitle: 'Quellennachweis einblenden',
          },
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      plugins: {
        attributions: {
          button: {
            closeTitle: 'Hide Attributions',
            openTitle: 'Show Attributions',
          },
        },
      },
    },
  },
]

export default language
