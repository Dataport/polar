import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        legend: {
          title: 'Legenden',
          legendTo: 'Legendenbild zu "{{name}}"',
          openLegendTo: '$t(common:plugins.legend.legendTo) öffnen',
          empty: 'Keine Legende konfiguriert',
          button: {
            closeTitle: 'Legenden ausblenden',
            openTitle: 'Legenden einblenden',
          },
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      plugins: {
        legend: {
          title: 'Legends',
          legendTo: '"{{name}}" legend image',
          openLegendTo: 'Open $t(common:plugins.legend.legendTo)',
          empty: 'No legend configured',
          button: {
            closeTitle: 'Hide legends',
            openTitle: 'Show legends',
          },
        },
      },
    },
  },
]

export default language
