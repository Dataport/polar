import { Feature, FeatureCollection } from 'geojson'
import { Map } from 'ol'
import { Store } from 'vuex'
import levenshtein from 'js-levenshtein'
import { CoreState } from '@polar/lib-custom-types'
import { wgs84ProjectionCode } from '../common'
import { ResponseName, ResponsePayload, ResponseResult } from './types'
import { getAllPages } from './getAllPages'
import { geoJson, ignoreIds, wellKnownText } from './common'

interface CoastalGazetteerParameters {
  epsg: `EPSG:${string}`
  map: Map
}

// arbitrary sort based on input – prefer 1. startsWith 2. closer string
const sorter =
  (searchPhrase: string, sortKey: string) =>
  (a: ResponseName | Feature, b: ResponseName | Feature) => {
    const aStartsWith = a[sortKey].startsWith(searchPhrase)
    const bStartsWith = b[sortKey].startsWith(searchPhrase)

    return aStartsWith && !bStartsWith
      ? -1
      : !aStartsWith && bStartsWith
      ? 1
      : levenshtein(a[sortKey], searchPhrase) -
        levenshtein(b[sortKey], searchPhrase)
  }

const getEmptyFeatureCollection = (): FeatureCollection => ({
  type: 'FeatureCollection',
  features: [],
})

const featurify =
  (epsg: `EPSG:${string}`, searchPhrase: string) =>
  (feature: ResponseResult): Feature => ({
    type: 'Feature',
    geometry: geoJson.writeGeometryObject(
      // NOTE currently only the first geometry is used
      wellKnownText.readGeometry(
        feature.geoms.find(
          (geom) => !ignoreIds.geometries.includes(geom.GeomID)
        )?.WKT,
        {
          dataProjection: wgs84ProjectionCode,
          featureProjection: epsg,
        }
      )
    ),
    id: feature.id,
    properties: {
      names: feature.names,
      geometries: feature.geoms.filter(
        (geom) => !ignoreIds.geometries.includes(geom.GeomID)
      ),
    },
    // @ts-expect-error | used in POLAR for text display
    title:
      feature.names.sort(sorter(searchPhrase, 'Name'))[0]?.Name ||
      'textLocator.addressSearch.unnamed',
  })

const featureCollectionify = (
  fullResponse: ResponsePayload,
  epsg: `EPSG:${string}`,
  searchPhrase: string
): FeatureCollection => {
  const featureCollection = getEmptyFeatureCollection()
  featureCollection.features.push(
    ...fullResponse.results.reduce((accumulator, feature) => {
      if (ignoreIds.global.includes(feature.id)) {
        return accumulator
      }
      try {
        // TODO this shouldn't be try-catch, it's detectable
        const featurified = featurify(epsg, searchPhrase)(feature)
        accumulator.push(featurified)
        return accumulator
      } catch (e) {
        return accumulator
      }
    }, [] as Feature[])
  )
  featureCollection.features = featureCollection.features.sort(
    sorter(searchPhrase, 'title')
  )
  return featureCollection
}

export async function searchCoastalGazetteerByToponym(
  this: Store<CoreState>,
  signal: AbortSignal,
  url: string,
  inputValue: string,
  queryParameters: CoastalGazetteerParameters
): Promise<FeatureCollection> | never {
  let fullResponse: ResponsePayload
  try {
    fullResponse = await getAllPages.call(
      this,
      signal,
      url,
      { keyword: inputValue },
      queryParameters.epsg
    )
  } catch (e) {
    console.error(e)
    this.dispatch('plugin/toast/addToast', {
      type: 'error',
      text: 'textLocator.error.searchCoastalGazetteer',
    })
    return getEmptyFeatureCollection()
  }
  return Promise.resolve(
    featureCollectionify(fullResponse, queryParameters.epsg, inputValue)
  )
}
