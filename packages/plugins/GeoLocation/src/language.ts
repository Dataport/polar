import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
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
          markerText: 'Own location',
          button: {
            tooltip: {
              placeLocationMarker: 'Mark own location',
              removeLocationMarker: 'Remove location marker',
              locationAccessDenied: 'Location access denied by user',
            },
          },
          toast: {
            notInBoundary: "You are not within the map's boundaries.",
          },
        },
      },
    },
  },
]

export default language
