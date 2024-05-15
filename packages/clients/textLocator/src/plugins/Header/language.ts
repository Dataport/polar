import { LanguageOption } from '@polar/lib-custom-types'

const lang: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        textLocator: {
          header: {
            // remove lang="en" in component if this becomes German
            text: 'TextLocator',
          },
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      plugins: {
        textLocator: {
          header: {
            text: 'TextLocator',
          },
        },
      },
    },
  },
]

export default lang
