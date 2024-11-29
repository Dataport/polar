import { alkisWfs, dishCloudBaseUrl } from './services'

export const categoryIdAlkisSearch = 'categoryAlkisSuche'
export const categoryIdBkgSearch = 'categoryBkgSuche'

export const bkgSearch = {
  groupId: 'groupDenkmalsuche',
  categoryId: categoryIdBkgSearch,
  queryParameters: {
    filter: {
      bundesland: 'Schleswig-Holstein',
    },
  },
  type: 'bkg',
  url: `${dishCloudBaseUrl}/search/geosearch.json`,
}

export const alkisSearch = {
  groupId: 'groupDenkmalsuche',
  categoryId: categoryIdAlkisSearch,
  type: 'wfs',
  url: `${dishCloudBaseUrl}/dish/bkg/ALKIS_WFS`,
  queryParameters: {
    id: alkisWfs,
    maxFeatures: 120,
    srsName: 'EPSG:25832',
    typeName: 'Flurstueck',
    featurePrefix: 'ave',
    xmlns:
      'http://repository.gdi-de.org/schemas/adv/produkt/alkis-vereinfacht/2.0',
    patternKeys: {
      flstnrnen: '([0-9]+)',
      flstnrzae: '([0-9]+)',
      gemarkung: '([A-Za-z]+)',
      flstkennz: '([0-9_]+)',
    },
    patterns: [
      '{{gemarkung}} {{flstnrzae}}/{{flstnrnen}}, {{flstkennz}}',
      '{{gemarkung}} {{flstnrzae}}, {{flstkennz}}',
      '{{flstkennz}}',
    ],
  },
}

export const categoryBkgSearch = {
  label: 'Adresssuche Treffer',
}

export const categoryAlkisSearch = {
  label: 'Flurstückssuche Treffer',
}

export const groupProperties = {
  groupDenkmalsuche: {
    label: 'Suche Denkmal, Adresse, Flurstück',
    hint: 'common:dish.addressSearchHint',
    resultDisplayMode: 'categorized',
    limitResults: 3,
  },
  defaultGroup: {
    limitResults: 3,
  },
}
