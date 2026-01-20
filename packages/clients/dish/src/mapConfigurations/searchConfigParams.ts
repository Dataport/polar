import { AddressSearchGroupProperties } from '@polar/lib-custom-types'
import { BKGParameters } from '@polar/plugin-address-search'
import {
  dishCloudBaseUrl,
  dishBaseUrl,
  denkmaelerWFS,
  alkisWfs,
} from '../servicesConstants'

const groupDenkmalsuche = 'groupDenkmalsuche'

/**
 * Sortiert Features nach mehreren Eigenschaften
 * @param features - Array von Features
 * @param sortKeys - Array von Property-Namen zum Sortieren (in Prioritätsreihenfolge)
 * @param numericKeys - Array von Property-Namen, die numerisch statt alphabetisch sortiert werden sollen
 * @returns Sortiertes Features-Array
 */
const sortFeaturesByProperties = (
  features: any[],
  sortKeys: string[],
  numericKeys: string[] = []
): any[] => {
  return features.sort((a, b) => {
    for (const key of sortKeys) {
      const valueA = a.properties?.[key] ?? ''
      const valueB = b.properties?.[key] ?? ''

      let comparison = 0

      if (numericKeys.includes(key)) {
        const numA = parseFloat(String(valueA)) || 0
        const numB = parseFloat(String(valueB)) || 0
        comparison = numA - numB
      } else {
        comparison = String(valueA).localeCompare(String(valueB))
      }

      if (comparison !== 0) {
        return comparison
      }
    }
    return 0
  })
}

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
      maxFeatures: 120,
      patternKeys: {
        hausnummer: '([0-9]+)',
        strasse: '([A-Za-z]+)',
        objektansprache: '([A-Za-z]+)',
        kreis_kue: '([A-Za-z]+)',
        gemeinde: '([A-Za-z]+)',
        objektid: '([0-9]+)',
      },
      patterns: [
        '{{objektansprache}}, {{strasse}} {{hausnummer}}, {{kreis_kue}}, {{gemeinde}}, ONR {{objektid}}',
        '{{strasse}} {{hausnummer}}, {{kreis_kue}}, {{gemeinde}}',
        '{{objektansprache}}, {{gemeinde}}, ONR {{objektid}}',
      ],
    },
  },
  alkisSearch: {
    groupId: groupDenkmalsuche,
    categoryId: 'categoryIdAlkisSearch',
    type: 'alkis',
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
        gemeinde: '([A-Za-z]+)',
        flstkennz: '([0-9_]+)',
        flur: '([0-9]+)',
      },
      patterns: [
        '{{gemeinde}}, {{gemarkung}} {{flur}}, {{flstnrzae}}/{{flstnrnen}}, {{flstkennz}}',
        '{{gemeinde}}, {{gemarkung}} {{flur}}, {{flstnrzae}}, {{flstkennz}}',
        '{{flstkennz}}',
      ],
    },
    resultModifier: (featureCollection) => {
      if (
        featureCollection.features === undefined ||
        featureCollection.features === null
      ) {
        return featureCollection
      }
      const featuresSorted = sortFeaturesByProperties(
        featureCollection.features,
        ['gemeinde', 'gemarkung', 'flur', 'flstnrzae', 'flstnrnen'],
        ['flur', 'flstnrzae', 'flstnrnen']
      )
      return {
        ...featureCollection,
        features: featuresSorted,
      }
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
