import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        iconMenu: {
          hints: {
            geometrySearch: 'Geometriesuche',
          },
        },
        geometrySearch: {},
      },
    },
  },
  {
    type: 'en',
    resources: {
      plugins: {
        iconMenu: {
          hints: {
            geometrySearch: 'Geometry search',
          },
        },
        geometrySearch: {},
      },
    },
  },
]

export default language
