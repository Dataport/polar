import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
  plugins: {
    scale: {
      toOneNegative: 'Skalierung muss eine positive Zahl sein',
      label: 'Skala',
      scaleSwitcher: 'Maßstab ändern',
    },
  },
} as const

export const resourcesEn = {
  plugins: {
    scale: {
      toOneNegative: 'scale must be a positive number',
      label: 'Scale',
      scaleSwitcher: 'Change scale',
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
