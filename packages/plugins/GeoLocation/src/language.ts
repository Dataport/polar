import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        geoLocation: {
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
    },
  },
  {
    type: 'en',
    resources: {
      plugins: {
        geoLocation: {
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
    },
  },
]

export default language
