import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
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
} as const

export const resourcesEn = {
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
} as const

const locales: Locale[] = [
  {
    type: 'de',
    resources: resourcesDe,
  },
  {
    type: 'en',
    resources: resourcesEn,
  },
]

export default locales
