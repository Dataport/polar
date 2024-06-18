import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        zoom: {
          in: 'Hinein zoomen',
          out: 'Heraus zoomen',
          slider: 'Zoom Schieberegler',
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
          slider: 'Zoom Slider',
        },
      },
    },
  },
]

export default language
