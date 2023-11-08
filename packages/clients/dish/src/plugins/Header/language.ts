import { LanguageOption } from '@polar/lib-custom-types'

const lang: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        dish: {
          header: {
            text: 'Denkmalkarte Schleswig-Holstein',
          },
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      plugins: {
        dish: {
          header: {},
        },
      },
    },
  },
]

export default lang
