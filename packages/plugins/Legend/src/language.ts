import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
  plugins: {
    legend: {
      title: 'Legenden',
      legendTo: 'Legendenbild zu "{{name}}"',
      openLegendTo: '$t(plugins.legend.legendTo) öffnen',
      empty: 'Keine Legende konfiguriert',
      button: {
        closeTitle: 'Legenden ausblenden',
        openTitle: 'Legenden einblenden',
      },
    },
  },
} as const

export const resourcesEn = {
  plugins: {
    legend: {
      title: 'Legends',
      legendTo: '"{{name}}" legend image',
      openLegendTo: 'Open $t(plugins.legend.legendTo)',
      empty: 'No legend configured',
      button: {
        closeTitle: 'Hide legends',
        openTitle: 'Show legends',
      },
    },
  },
} as const

const language: Locale[] = [
  {
    type: 'de',
    resources: resourcesDe,
  },
  {
    type: 'en',
    resources: resourcesEn,
  },
]

export default language
