import { AddressSearchGroupProperties } from '@polar/lib-custom-types'
import { BKGParameters } from '@polar/plugin-address-search'
import {
  alkisWfs,
  denkmaelerWFS,
  dishBaseUrl,
  dishCloudBaseUrl,
} from '../servicesConstants'

const groupDenkmalsuche = 'groupDenkmalsuche'

export const searchMethods = {
  denkmalsucheAutocomplete: {
    groupId: groupDenkmalsuche,
    categoryId: 'categoryDenkmalsucheAutocomplete',
    type: 'autocomplete',
    // NOTE exotic, doesn't need URL
    url: 'example.com',
    queryParameters: {
      maxFeatures: 120,
    },
  },
  denkmalsucheDishExtern: {
    groupId: groupDenkmalsuche,
    categoryId: 'categoryDenkmalsucheDishExtern',
    type: 'dish',
    url: `${dishBaseUrl}/dish_service/service.aspx`,
    queryParameters: {
      wfsConfiguration: {
        id: denkmaelerWFS,
        srsName: 'EPSG:25832',
        typeName: 'dish_shp',
        fieldName: 'objektid',
        featurePrefix: 'app',
        xmlns: 'http://www.deegree.org/app',
      },
      maxFeatures: 120,
      searchKey: 'volltext',
      addRightHandWildcard: true,
      topic: null,
    },
  },
  bkgSearch: {
    groupId: groupDenkmalsuche,
    categoryId: 'categoryIdBkgSearch',
    queryParameters: {
      maxFeatures: 120,
      filter: {
        bundesland: 'Schleswig-Holstein',
      },
    } as BKGParameters,
    type: 'bkg',
    url: `${dishCloudBaseUrl}/search/geosearch.json`,
  },
  denkmalsucheDishIntern: {
    groupId: groupDenkmalsuche,
    categoryId: 'categoryDenkmalsucheDishIntern',
    type: 'wfs',
    // url is in mapConfig due to variable setting,
    queryParameters: {
      id: denkmaelerWFS,
      srsName: 'EPSG:25832',
      typeName: 'TBLGIS_ORA',
      featurePrefix: 'app',
      xmlns: 'http://www.deegree.org/app',
      useRightHandWildcard: true,
      patternKeys: {
        hausnummer: '([0-9]+)',
        strasse: '([A-Za-z]+)',
        objektansprache: '([A-Za-z]+)',
        kreis_kue: '([A-Za-z]+)',
        objektid: '([0-9]+)',
      },
      patterns: [
        '{{objektansprache}}, {{strasse}} {{hausnummer}}, {{kreis_kue}}, {{objektid}}',
        '{{strasse}} {{hausnummer}}, {{kreis_kue}}',
        ' {{objektansprache}}, {{objektid}}',
      ],
    },
  },
  alkisSearch: {
    groupId: groupDenkmalsuche,
    categoryId: 'categoryIdAlkisSearch',
    type: 'wfs',
    // will be set later due to mode setting
    url: null,
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
        flur: '([0-9]+)',
      },
      patterns: [
        '{{gemarkung}} {{flur}}, {{flstnrzae}}/{{flstnrnen}}, {{flstkennz}}',
        '{{gemarkung}} {{flur}}, {{flstnrzae}}, {{flstkennz}}',
        '{{flstkennz}}',
      ],
    },
  },
}

export const categoryProps = {
  categoryDenkmalsucheAutocomplete: {
    label: 'Denkmalsuche Stichworte Treffer',
  },
  categoryDenkmalsucheDishExtern: {
    label: 'Denkmalsuche Treffer',
  },
  categoryDenkmalsucheDishIntern: {
    label: 'Denkmalsuche Treffer',
  },
  categoryIdBkgSearch: {
    label: 'Adresssuche Treffer',
  },
  categoryIdAlkisSearch: {
    label: 'Flurstückssuche Treffer',
  },
}

export const groupProperties: Record<string, AddressSearchGroupProperties> = {
  [groupDenkmalsuche]: {
    label: 'Suche Denkmal, Adresse, Flurstück',
    hint: 'dish.addressSearchHint',
    resultDisplayMode: 'categorized',
    limitResults: 3,
  },
}
