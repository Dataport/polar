import { Locale } from '@polar/lib-custom-types'
import gfiLocales from './plugins/Gfi/locales'

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
  ...gfiLocales,
]

export default locales
