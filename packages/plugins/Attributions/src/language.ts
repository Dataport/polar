import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        attributions: {
          button: {
            closeTitle: 'Quellennachweis ausblenden',
            openTitle: 'Quellennachweis einblenden',
          },
          sourceCode:
            '<span><a href="https://github.com/Dataport/polar" target="_blank">Quellcode</a> lizenziert unter <a href="https://github.com/Dataport/polar/blob/main/LICENSE" target="_blank">EUPL v1.2</a></span>',
          title: 'Quellennachweis',
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      plugins: {
        attributions: {
          button: {
            closeTitle: 'Hide Attributions',
            openTitle: 'Show Attributions',
          },
          sourceCode:
            '<span><a href="https://github.com/Dataport/polar" target="_blank">Source code</a> licensed under <a href="https://github.com/Dataport/polar/blob/main/LICENSE" target="_blank">EUPL v1.2</a></span>',
          title: 'Attributions',
        },
      },
    },
  },
]

export default language
