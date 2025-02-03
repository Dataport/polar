import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
  plugins: {
    loadingIndicator: {
      loading: 'Lädt...',
    },
  },
} as const

export const resourcesEn = {
  plugins: {
    loadingIndicator: {
      loading: 'Loading...',
    },
  },
} as const

const language: Locale[] = [
  {
    type: 'de',
    resources: resourcesDe,
  },
  {
    type: 'en',
    resources: resourcesEn,
  },
]

export default language
