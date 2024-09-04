import {
  CoreGetters,
  CoreState,
  PolarStore,
  SelectResultFunction,
} from '@polar/lib-custom-types'
// TODO relink import to plugin root export when that is merged
import SearchResultSymbols from '@polar/plugin-address-search/src/utils/searchResultSymbols'
import { Feature, FeatureCollection } from 'geojson'
import { GeometrySearchState } from '../plugins/GeometrySearch/types'
import urlSuffix from './urlSuffix'
import { searchCoastalGazetteerByToponym } from './coastalGazetteer/searchToponym'

export interface Literature {
  title: string
  location_hits_title: Record<string, number>
  location_hits_text: Record<string, number>
  meta_data?: Record<string, string>
  id?: string
}

export interface SearchResponse {
  documents: Literature[]
}

export interface LiteratureFeature extends Feature {
  properties: Literature
  title: string
}

const weightenHits = (
  headerHits: Record<string, number>,
  bodyHits: Record<string, number>,
  headerWeight: number
): Record<string, number> =>
  Object.entries(headerHits).reduce(
    (accumulator, [toponym, count]) => {
      if (accumulator[toponym]) {
        accumulator[toponym] += count * headerWeight
      }
      accumulator[toponym] = count * headerWeight
      return accumulator
    },
    { ...bodyHits }
  )

const mapLiteratureResponseToFeatureCollection = (
  literatureResponse: Literature[]
): FeatureCollection => ({
  type: 'FeatureCollection',
  features: literatureResponse.map((literature) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [0, 0],
    },
    properties: literature,
    epsg: null,
    title: literature.title,
  })),
})

export function searchLiterature(
  this: PolarStore<CoreState, CoreGetters>,
  signal: AbortSignal,
  url: string,
  inputValue: string
): Promise<FeatureCollection> {
  return fetch(`${url}${urlSuffix.findDocumentsByTitle}`, {
    method: 'POST',
    headers: {
      // NOTE required by API
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ search_word: inputValue }),
    signal,
  })
    .then((response): Promise<SearchResponse> => {
      if (response.ok) {
        return response.json()
      }
      throw response
    })
    .then((searchResponse) =>
      mapLiteratureResponseToFeatureCollection(searchResponse.documents)
    )
    .catch((error) => {
      // if not intentional ("operation was aborted" = "user types more")
      if (!signal.aborted) {
        console.error(error)
        this.dispatch('plugin/toast/addToast', {
          type: 'warning',
          text: 'common:textLocator.error.findLiterature',
        })
      }

      const emptyFeatureCollection: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      }

      return emptyFeatureCollection
    })
}

// NOTE hits and featureCollections are in sync; that is, hits[i] had findings featureCollections[i] in gazetteer
const processLiteratureToponyms =
  (literatureFeature: LiteratureFeature, hits: Record<string, number>) =>
  (featureCollections: FeatureCollection[]) => {
    // TODO implement so that GeometrySearch is fed with fitting tree display
    console.warn(literatureFeature, hits)
    console.warn(featureCollections)
  }

// done to get type in
// eslint-disable-next-line func-style
export const selectLiterature: SelectResultFunction = function (
  this: PolarStore<GeometrySearchState, GeometrySearchState>,
  // TODO apply unanyfication
  { commit, rootGetters },
  { feature }: { feature: LiteratureFeature }
) {
  // default behaviour (AddressSearch selects and is not involved in further behaviour
  commit('plugin/addressSearch/setChosenAddress', null, { root: true })
  commit('plugin/addressSearch/setInputValue', feature.title, { root: true })
  commit(
    'plugin/addressSearch/setSearchResults',
    SearchResultSymbols.NO_SEARCH,
    { root: true }
  )

  // start searching for included toponyms
  const { location_hits_title: headerHits, location_hits_text: bodyHits } =
    feature.properties

  // TODO it is undecided what value a header hit has in comparison to a body hit; just going 10* for now
  const hits = weightenHits(headerHits, bodyHits, 10)

  Promise.all(
    Object.entries(hits).map(([toponym]) =>
      searchCoastalGazetteerByToponym.call(
        this,
        new AbortController().signal, // dummy, no aborting implemented here
        rootGetters['plugin/addressSearch/searchMethods'].find(
          (searchMethod) => searchMethod.type === 'coastalGazetteer'
        ).url,
        toponym,
        {
          map: rootGetters.map,
          epsg: rootGetters.configuration.epsg,
        }
      )
    )
  )
    .then(processLiteratureToponyms(feature, hits))
    .catch(console.error) // search function already printed toasts
}
