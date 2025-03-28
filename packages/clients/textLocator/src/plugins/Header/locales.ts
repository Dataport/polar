import { Locale } from '@polar/lib-custom-types'

export const textLocatorDe = {
  // remove lang="en" in component if this becomes German
  header: {
    text: 'TextLocator',
  },
} as const

const locales: Locale[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        textLocator: {
          ...textLocatorDe,
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

export default locales
