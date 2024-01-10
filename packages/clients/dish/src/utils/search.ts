import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'
import { getWfsFeatures } from '@polar/lib-get-features'
import { getLayerWhere } from '@masterportal/masterportalapi/src/rawLayerList'
import {
  WfsConfiguration,
  EfiSearchFeature,
  ParsedEfiSearchFeature,
  DishParameters,
} from '../types'
import { parseBeschreibung } from './extendGfi'

// key to avoid typos
const dishBackendSizeError = 'DISH Backend Size Error'

/**
 * fetches feature geometry from WFS
 * (search service is separate and geometryless)
 */
const addGeometries = async (
  features: ParsedEfiSearchFeature[],
  wfsConfiguration: WfsConfiguration
): Promise<ParsedEfiSearchFeature[]> => {
  const { url } = getLayerWhere({ id: wfsConfiguration.id })

  const wfsFeatures = await Promise.all(
    features.map((feature) =>
      // NOTE: works by specification of linkText field
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      getWfsFeatures(null, url, feature.linkText.match(/\d+/)![0], {
        ...wfsConfiguration,
        useRightHandWildcard: false,
      })
    )
  )

  const featureWithMaybeWfsGeometry = features.map((feature, index) => {
    const wfsFeatureCollection = wfsFeatures[index]
    const wfsFeature = wfsFeatureCollection.features[0]
    if (wfsFeature) feature.geometry = { ...wfsFeature.geometry }
    return feature
  })

  // databases may not be synchronous – warn and discard feature
  const featureWithWfsGeometry = featureWithMaybeWfsGeometry.filter(
    (feature) => {
      const keep = Boolean(feature.geometry)
      if (!keep) {
        console.warn(
          `@polar/client-dish: Feature had no matching geometry and can't be used: ${JSON.stringify(
            feature
          )}`
        )
      }
      return keep
    }
  )

  return featureWithWfsGeometry
}

/**
 * DISH "Denkmalsuche" search method (injectable for plugin/AddressSearch)
 */
export function search(
  signal: AbortSignal,
  url: string,
  inputValue: string,
  queryParameters: DishParameters
): Promise<FeatureCollection> | never {
  const maxFeatures = queryParameters.maxFeatures || Infinity
  const searchKey = queryParameters.searchKey || 'volltext'
  const volltexttyp =
    searchKey === 'volltext' ? queryParameters.volltexttyp || 'CONTAINS' : ''
  let cleanedInputValue = inputValue
    .replaceAll(/[()]/g, '')
    .replaceAll('.', ' ')
    .replaceAll('- ', ' ')
    .replaceAll(': ', ' ')
  while (cleanedInputValue.includes('  ')) {
    cleanedInputValue = cleanedInputValue.replaceAll('  ', ' ')
  }
  const preparedInputValue = queryParameters.addRightHandWildcard
    ? cleanedInputValue.split(' ').join('* ') + '*'
    : cleanedInputValue
  return fetch(
    `${url}?${searchKey}=${preparedInputValue}${
      volltexttyp ? `&volltexttyp=${volltexttyp}` : ''
    }`,
    { signal }
  )
    .then((response) => response.text())
    .then((text) => {
      try {
        if (text === '') return []
        return JSON.parse(text)
      } catch (error) {
        if (
          text.includes(
            'The length of the string exceeds the value set on the maxJsonLength property'
          )
        ) {
          throw new Error(dishBackendSizeError)
        }
        throw error
      }
    })
    .then((json: EfiSearchFeature[]): ParsedEfiSearchFeature[] =>
      json.map((feature) => ({
        ...feature,
        beschreibung: parseBeschreibung(feature.beschreibung),
      }))
    )
    .then((features) =>
      features
        .sort(({ rating: ratingA }, { rating: ratingB }): number => {
          const comparableA = parseInt(ratingA || '0', 10)
          const comparableB = parseInt(ratingB || '0', 10)
          return comparableB - comparableA
        })
        .slice(0, maxFeatures)
    )
    .then((features) =>
      addGeometries(features, queryParameters.wfsConfiguration)
    )
    .then(
      (features): FeatureCollection => ({
        type: 'FeatureCollection',
        features: features.map(({ geometry, ...rest }) => ({
          type: 'Feature',
          geometry: geometry as Geometry,
          properties: rest as GeoJsonProperties,
          epsg: queryParameters.wfsConfiguration.srsName,
          title:
            (rest.beschreibung?.strasse
              ?.replaceAll('||', ' ')
              .replaceAll('\r', ' ')
              .trim() || 'Ohne Adresseintrag ') +
            ` (${rest.beschreibung?.objektansprache?.trim()})`,
        })),
      })
    )
    .catch((error) => {
      // if not intentional ("operation was aborted" = "user types more")
      if (!signal.aborted) {
        console.error('@polar/client-dish', error)
        if (error.message === dishBackendSizeError) {
          this.dispatch('plugin/toast/addToast', {
            type: 'warning',
            text: 'common:dish.backendSizeError',
          })
        } else {
          this.dispatch('plugin/toast/addToast', {
            type: 'error',
            text: 'common:dish.unknownError',
          })
        }
      }

      const emptyFeatureCollection: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      }

      return emptyFeatureCollection
    })
}
