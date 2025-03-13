import { Locale } from '@polar/lib-custom-types'

export const diplanDe = {
  diplan: {
    error: {
      metaInformationRetrieval:
        'Der Bezug von Metadaten zur gezeichneten Geometrie ist fehlgeschlagen. Die Geometrie wird ohne Metadaten weitergereicht.',
    },
    warn: {
      unevenCut:
        'Leider konnte kein Schnitt hergestellt werden, da entweder der Start- oder Endpunkt der Schnittkante innerhalb des zu schneidenden Polygons lag, oder kein Polygon geschnitten wurde. Bitte versuchen Sie es erneut.',
    },
  },
} as const

const locales: Locale[] = [
  {
    type: 'de',
    resources: diplanDe,
  },
]

export default locales
