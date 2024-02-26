import { LanguageOption } from '@polar/lib-custom-types'
import {
  openStreetMap,
  openSeaMap,
  mdiSeaNames,
  wmtsTopplusOpenWeb,
  wmtsTopplusOpenWebGrey,
  wmtsTopplusOpenLight,
  wmtsTopplusOpenLightGrey,
} from './services'

// Gefundene Orte
// Gefundene Texte

const locales: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      textLocator: {
        layers: {
          [openStreetMap]: 'OpenStreetMap',
          [openSeaMap]: 'OpenSeaMap',
          [mdiSeaNames]: 'Namensdienst Küste',
          [wmtsTopplusOpenWeb]: 'TopPlusOpen (Web)',
          [wmtsTopplusOpenWebGrey]: 'TopPlusOpen (Web, Grau)',
          [wmtsTopplusOpenLight]: 'TopPlusOpen (Light)',
          [wmtsTopplusOpenLightGrey]: 'TopPlusOpen (Light, Grau)',
        },
        addressSearch: {
          unnamed: 'Unbenannt',
        },
        attributions: {
          [openStreetMap]: `$t(textLocator.layers.${openStreetMap}): © <a href='https://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a> contributors`,
          [openSeaMap]: `$t(textLocator.layers.${openSeaMap}): © <a href='https://www.openseamap.org/ target='_blank''>OpenSeaMap</a>`,
          [mdiSeaNames]: `$t(textLocator.layers.${mdiSeaNames}): © <a href='https://projekt.mdi-de.org/kuesten-gazetteer/ target='_blank''>MDI DE</a>`,
          [wmtsTopplusOpenWeb]: `$t(textLocator.layers.${wmtsTopplusOpenWeb}): © Bundesamt für Kartographie und Geodäsie <YEAR>`,
          [wmtsTopplusOpenWebGrey]: `$t(textLocator.layers.${wmtsTopplusOpenWebGrey}): © Bundesamt für Kartographie und Geodäsie <YEAR>`,
          [wmtsTopplusOpenLight]: `$t(textLocator.layers.${wmtsTopplusOpenLight}): © Bundesamt für Kartographie und Geodäsie <YEAR>`,
          [wmtsTopplusOpenLightGrey]: `$t(textLocator.layers.${wmtsTopplusOpenLightGrey}): © Bundesamt für Kartographie und Geodäsie <YEAR>`,
          static:
            '<br><a href="https://github.com/Dataport/polar/blob/main/LEGALNOTICE.md">Impressum</a>',
        },
        error: {
          searchCoastalGazetteer:
            'Die Suche ist mit einem unbekannten Fehler fehlgeschlagen. Bitte versuchen Sie es später erneut.',
        },
      },
      plugins: {
        addressSearch: {
          defaultGroup: 'Ortssuche',
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      textLocator: {
        layers: {
          [openStreetMap]: 'OpenStreetMap',
          [openSeaMap]: 'OpenSeaMap',
          [mdiSeaNames]: 'Coastal name service',
          [wmtsTopplusOpenWeb]: 'TopPlusOpen (Web)',
          [wmtsTopplusOpenWebGrey]: 'TopPlusOpen (Web, Grey)',
          [wmtsTopplusOpenLight]: 'TopPlusOpen (Light)',
          [wmtsTopplusOpenLightGrey]: 'TopPlusOpen (Light, Grey)',
        },
        addressSearch: {
          unnamed: 'Unnamed',
        },
        attributions: {
          [openStreetMap]: `$t(textLocator.layers.${openStreetMap}): © <a href='https://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a> contributors`,
          [openSeaMap]: `$t(textLocator.layers.${openSeaMap}): © <a href='https://www.openseamap.org/ target='_blank''>OpenSeaMap</a>`,
          [mdiSeaNames]: `$t(textLocator.layers.${mdiSeaNames}): © <a href='https://projekt.mdi-de.org/kuesten-gazetteer/ target='_blank''>MDI DE</a>`,
          [wmtsTopplusOpenWeb]: `$t(textLocator.layers.${wmtsTopplusOpenWeb}): © Bundesamt für Kartographie und Geodäsie <YEAR>`,
          [wmtsTopplusOpenWebGrey]: `$t(textLocator.layers.${wmtsTopplusOpenWebGrey}): © Bundesamt für Kartographie und Geodäsie <YEAR>`,
          [wmtsTopplusOpenLight]: `$t(textLocator.layers.${wmtsTopplusOpenLight}): © Bundesamt für Kartographie und Geodäsie <YEAR>`,
          [wmtsTopplusOpenLightGrey]: `$t(textLocator.layers.${wmtsTopplusOpenLightGrey}): © Bundesamt für Kartographie und Geodäsie <YEAR>`,
          static:
            '<br><a href="https://github.com/Dataport/polar/blob/main/LEGALNOTICE.md">Legal notice (Impressum)</a>',
        },
        error: {
          searchCoastalGazetteer:
            'The search failed with an unknown error. Please try again later.',
        },
      },
      plugins: {
        addressSearch: {
          defaultGroup: 'Location search',
        },
      },
    },
  },
]

export default locales
