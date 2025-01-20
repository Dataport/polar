import { LanguageOption } from '@polar/lib-custom-types'
import {
  openStreetMap,
  openSeaMap,
  mdiSeaNames,
  wmtsTopplusOpenWeb,
  wmtsTopplusOpenWebGrey,
  wmtsTopplusOpenLight,
  wmtsTopplusOpenLightGrey,
  aerial,
} from './services'

export const textLocatorDe = {
  layers: {
    [openStreetMap]: 'OpenStreetMap',
    [openSeaMap]: 'OpenSeaMap',
    [mdiSeaNames]: 'Namensdienst Küste',
    [wmtsTopplusOpenWeb]: 'TopPlusOpen (Web)',
    [wmtsTopplusOpenWebGrey]: 'TopPlusOpen (Web, Grau)',
    [wmtsTopplusOpenLight]: 'TopPlusOpen (Light)',
    [wmtsTopplusOpenLightGrey]: 'TopPlusOpen (Light, Grau)',
    [aerial]: 'Luftbilder Sen2Europe',
  },
  addressSearch: {
    resultInfo: {
      name: 'Name',
      type: 'Typ',
      language: 'Sprache',
      timeFrame: 'Zeitraum',
    },
    groupTL: 'Literatur- und Ortssuche',
    toponym: 'Ortssuche',
    literature: 'Literatursuche',
  },
  attributions: {
    [openStreetMap]: `$t(textLocator.layers.${openStreetMap}): © <a href='https://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a> contributors`,
    [openSeaMap]: `$t(textLocator.layers.${openSeaMap}): © <a href='https://www.openseamap.org/ target='_blank''>OpenSeaMap</a>`,
    [mdiSeaNames]: `$t(textLocator.layers.${mdiSeaNames}): © <a href='https://projekt.mdi-de.org/kuesten-gazetteer/ target='_blank''>MDI DE</a>`,
    [wmtsTopplusOpenWeb]: `$t(textLocator.layers.${wmtsTopplusOpenWeb}): © Bundesamt für Kartographie und Geodäsie {{YEAR}}`,
    [wmtsTopplusOpenWebGrey]: `$t(textLocator.layers.${wmtsTopplusOpenWebGrey}): © Bundesamt für Kartographie und Geodäsie {{YEAR}}`,
    [wmtsTopplusOpenLight]: `$t(textLocator.layers.${wmtsTopplusOpenLight}): © Bundesamt für Kartographie und Geodäsie {{YEAR}}`,
    [wmtsTopplusOpenLightGrey]: `$t(textLocator.layers.${wmtsTopplusOpenLightGrey}): © Bundesamt für Kartographie und Geodäsie {{YEAR}}`,
    [aerial]: `$t(textLocator.layers.${aerial}): © Europäische Union, enthält veränderte Copernicus Sentinel-Daten ({{YEAR}})`,
    kuestengazetteer:
      '<br>Zur Ortssuche wird der <a href="https://projekt.mdi-de.org/kuesten-gazetteer/" target="_blank">Küstengazetteer</a> eingesetzt.',
    static:
      '<a href="https://github.com/Dataport/polar/blob/main/LEGALNOTICE.md" target="_blank">Impressum</a>',
  },
  info: {
    noLiteratureFound: 'Es wurden keine Texte zu diesen Orten gefunden.',
    noGeometriesFound: 'Es wurden keine Orte zu dieser Geometrie gefunden.',
    loadingTime:
      'Es gibt viele Ergebnisse zu der letzten Anfrage. Der Ladevorgang kann einen Moment länger dauern.',
  },
  error: {
    search:
      'Die Suche ist mit einem unbekannten Fehler fehlgeschlagen. Bitte versuchen Sie es später erneut.',
  },
} as const

const locales: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      textLocator: textLocatorDe,
    },
  },
  // NOTE: English translation not yet required and may be incomplete
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
          [aerial]: 'Aerial photographs Sen2Europe',
        },
        addressSearch: {
          unnamed: 'Unnamed',
        },
        attributions: {
          [openStreetMap]: `$t(textLocator.layers.${openStreetMap}): © <a href='https://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a> contributors`,
          [openSeaMap]: `$t(textLocator.layers.${openSeaMap}): © <a href='https://www.openseamap.org/ target='_blank''>OpenSeaMap</a>`,
          [mdiSeaNames]: `$t(textLocator.layers.${mdiSeaNames}): © <a href='https://projekt.mdi-de.org/kuesten-gazetteer/ target='_blank''>MDI DE</a>`,
          [wmtsTopplusOpenWeb]: `$t(textLocator.layers.${wmtsTopplusOpenWeb}): © Bundesamt für Kartographie und Geodäsie {{YEAR}}`,
          [wmtsTopplusOpenWebGrey]: `$t(textLocator.layers.${wmtsTopplusOpenWebGrey}): © Bundesamt für Kartographie und Geodäsie {{YEAR}}`,
          [wmtsTopplusOpenLight]: `$t(textLocator.layers.${wmtsTopplusOpenLight}): © Bundesamt für Kartographie und Geodäsie {{YEAR}}`,
          [wmtsTopplusOpenLightGrey]: `$t(textLocator.layers.${wmtsTopplusOpenLightGrey}): © Bundesamt für Kartographie und Geodäsie {{YEAR}}`,
          [aerial]: `$t(textLocator.layers.${aerial}): © European Union, contains modified Copernicus Sentinel data ({{YEAR}})`,
          static:
            '<br><a href="https://github.com/Dataport/polar/blob/main/LEGALNOTICE.md">Legal notice (Impressum)</a>',
        },
        info: {
          noLiteratureFound: 'No texts were found regarding these places.',
          noGeometriesFound: 'No places were found regarding this geometry.',
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
