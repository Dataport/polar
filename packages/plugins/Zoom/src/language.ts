import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        zoom: {
          in: 'Hinein zoomen',
          out: 'Heraus zoomen',
          slider: 'Zoomstufe wählen',
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      plugins: {
        zoom: {
          in: 'Zoom in',
          out: 'Zoom out',
          slider: 'Choose zoom level',
        },
      },
    },
  },
]

export default language
