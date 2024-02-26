// such names exist on the service
/* eslint-disable @typescript-eslint/naming-convention */
import { CoreState } from '@polar/lib-custom-types'
import { Feature, FeatureCollection } from 'geojson'
import { Map } from 'ol'
import { GeoJSON, WKT } from 'ol/format'
import { Store } from 'vuex'
import levenshtein from 'js-levenshtein'
import { makeRequestUrl } from './makeRequestUrl'

const ignoreIds = {
  global: ['EuroNat-33'],
  geometries: [
    'EuroNat-33',
    'SH-WATTENMEER-DM-1',
    'SH-WATTENMEER-1',
    'Ak2006-51529',
    'Landsg-2016-110',
  ],
}
const wellKnownText = new WKT()
const geoJson = new GeoJSON()

interface ResponseName {
  Start: string // YYYY-MM-DD
  Ende: string // YYYY-MM-DD
  GeomID: string
  ObjectID: string
  Name: string
  Quellen: object[] // not used
  Rezent: boolean
  Sprache: string
  Typ: string
}

interface ResponseGeom {
  Start: string // YYYY-MM-DD
  Ende: string // YYYY-MM-DD
  GeomID: string
  ObjectID: string
  Quellen: object[] // not used
  Typ: string
  'Typ Beschreibung': string
  WKT: string // WKT geometry
}

interface ResponseResult {
  id: string
  names: ResponseName[]
  geoms: ResponseGeom[]
}

interface ResponsePayload {
  count: string // numerical
  currentpage: string // numerical
  pages: string // numerical
  keyword: string
  querystring: string
  results: ResponseResult[]
  time: number
}

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

const getEmptyResponsePayload = (): ResponsePayload => ({
  count: '',
  currentpage: '',
  pages: '',
  keyword: '',
  querystring: '',
  results: [],
  time: NaN,
})

const mergeResponses = (
  initialResponse: ResponsePayload,
  responses: ResponsePayload[]
) => ({
  ...initialResponse,
  currentpage: 'merged',
  results: [
    initialResponse.results,
    ...responses.map(({ results }) => results),
  ].flat(1),
  time: NaN, // not used, setting NaN to indicate it's not the actual time
})

async function getAllPages(
  this: Store<CoreState>,
  signal: AbortSignal,
  url: string,
  inputValue: string,
  page: string | undefined,
  epsg: `EPSG:${string}`
): Promise<ResponsePayload> {
  const response = await fetch(
    makeRequestUrl(url, inputValue, page, undefined, epsg),
    {
      method: 'GET',
      signal,
    }
  )

  if (!response.ok) {
    this.dispatch('plugin/toast/addToast', {
      type: 'error',
      text: 'textLocator.error.searchCoastalGazetteer', // TODO use page || '1'
    })
    return getEmptyResponsePayload()
  }
  const responsePayload: ResponsePayload = await response.json()
  const pages = parseInt(responsePayload.pages, 10)
  const initialRequestMerge = typeof page === 'undefined' && pages > 1

  if (!initialRequestMerge) {
    return responsePayload
  }

  return mergeResponses(
    responsePayload,
    await Promise.all(
      Array.from(Array(pages - 1)).map((_, index) =>
        getAllPages.call(this, signal, url, inputValue, `${index + 2}`, epsg)
      )
    )
  )
}

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
          dataProjection: 'EPSG:4326',
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
      feature.names.sort(sorter(searchPhrase, 'Name'))[0]?.Name || 'Ohne Namen', // TODO i18n
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

export async function searchCoastalGazetteer(
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
      inputValue,
      undefined,
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
