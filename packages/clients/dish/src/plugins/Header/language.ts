import { Locale } from '@polar/lib-custom-types'

export const dishHeaderDe = {
  header: {
    text: 'Denkmalkarte Schleswig-Holstein',
  },
} as const

const lang: Locale[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        dish: {
          ...dishHeaderDe,
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
