import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
  plugins: {
    toast: {
      close: 'Benachrichtigung ausblenden',
    },
  },
} as const
export const resourcesEn = {
  plugins: {
    toast: {
      close: 'Hide notification',
    },
  },
} as const

const locales: Locale[] = [
  {
    type: 'de',
    resources: resourcesDe,
  },
  {
    type: 'en',
    resources: resourcesEn,
  },
]

export default locales
