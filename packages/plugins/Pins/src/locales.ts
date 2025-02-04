import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
  plugins: {
    pins: {
      toast: {
        notInBoundary: 'Diese Koordinate kann nicht gewählt werden.',
        boundaryError:
          'Die Überprüfung der Koordinate ist fehlgeschlagen. Bitte versuchen Sie es später erneut oder wenden Sie sich an einen Administrator, wenn das Problem bestehen bleibt.',
      },
    },
  },
} as const

export const resourcesEn = {
  plugins: {
    pins: {
      toast: {
        notInBoundary: 'It is not possible to select this coordinate.',
        boundaryError:
          'Validating the coordinate failed. Please try again later or contact an administrator if the issue persists.',
      },
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
