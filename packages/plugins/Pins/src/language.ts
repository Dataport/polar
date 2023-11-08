import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        pins: {
          toast: {
            notInBoundary: 'Diese Koordinate kann nicht gewählt werden.',
          },
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      plugins: {
        pins: {
          toast: {
            notInBoundary: 'It is not possible to select this coordinate.',
          },
        },
      },
    },
  },
]

export default language
