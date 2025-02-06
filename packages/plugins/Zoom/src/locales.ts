import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
  plugins: {
    zoom: {
      in: 'Hinein zoomen',
      out: 'Heraus zoomen',
      slider: 'Zoomstufe wählen',
    },
  },
} as const

export const resourcesEn = {
  plugins: {
    zoom: {
      in: 'Zoom in',
      out: 'Zoom out',
      slider: 'Choose zoom level',
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
