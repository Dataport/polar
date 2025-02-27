import { Locale } from '@polar/lib-custom-types'

export const diplanDe = {
  diplan: {
    error: {
      metaInformationRetrieval:
        'Der Bezug von Metadaten zur gezeichneten Geometrie ist fehlgeschlagen. Die Geometrie wird ohne Metadaten weitergereicht.',
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
