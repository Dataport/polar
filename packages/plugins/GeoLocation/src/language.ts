import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
  plugins: {
    geoLocation: {
      markerText: 'Aktuelle Position',
      button: {
        tooltip: {
          placeLocationMarker: 'Eigene Position markieren',
          removeLocationMarker: 'Positionsmarker entfernen',
          locationAccessDenied: 'Standortzugriff nutzerseitig abgelehnt',
        },
      },
      toast: {
        notInBoundary: 'Sie befinden sich nicht im Kartengebiet.',
        boundaryError:
          'Die Überprüfung Ihrer Position ist fehlgeschlagen. Bitte versuchen Sie es später erneut oder wenden Sie sich an einen Administrator, wenn das Problem bestehen bleibt.',
      },
    },
  },
} as const

export const resourcesEn = {
  plugins: {
    geoLocation: {
      markerText: 'Current location',
      button: {
        tooltip: {
          placeLocationMarker: 'Mark own location',
          removeLocationMarker: 'Remove location marker',
          locationAccessDenied: 'Location access denied by user',
        },
      },
      toast: {
        notInBoundary: "You are not within the map's boundaries.",
        boundaryError:
          'Validating your position failed. Please try later again or contact an administrator if the issue persists.',
      },
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
