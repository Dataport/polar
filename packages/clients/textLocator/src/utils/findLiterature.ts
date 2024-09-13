import {
  CoreGetters,
  CoreState,
  PolarStore,
  SelectResultFunction,
} from '@polar/lib-custom-types'
import { SearchResultSymbols } from '@polar/plugin-address-search'
import { Feature, FeatureCollection } from 'geojson'
import { GeometrySearchState } from '../plugins/GeometrySearch/types'
import urlSuffix from './urlSuffix'
import { searchCoastalGazetteerByToponym } from './coastalGazetteer/searchToponym'
import { sorter } from './coastalGazetteer/responseInterpreter'
import { TitleLocationFrequency } from './literatureByToponym'

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

// NOTE hit weighting is computed in the backend in a next iteration
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
const processLiteratureToponyms = (
  literatureFeature: LiteratureFeature,
  hits: Record<string, number>
) =>
  function (
    this: PolarStore<GeometrySearchState, GeometrySearchState>,
    featureCollections: FeatureCollection[]
  ) {
    const [featureCollection, titleLocationFrequencyChild] = Object.entries(
      hits
    ).reduce(
      (
        [featureCollection, titleLocationFrequencyChild],
        [toponym, count],
        index
      ) => {
        if (featureCollections[index].features.length) {
          const feature = featureCollections[index].features.sort(
            sorter(toponym, 'title')
          )[0]
          titleLocationFrequencyChild[feature.id || ''] =
            (titleLocationFrequencyChild[feature.id || ''] || 0) + count
          featureCollection.features.push(feature)
        }
        return [featureCollection, titleLocationFrequencyChild]
      },
      [
        { type: 'FeatureCollection', features: [] } as FeatureCollection,
        {} as TitleLocationFrequency['string'],
      ]
    )

    this.commit(
      'plugin/geometrySearch/setFeatureCollection',
      featureCollection,
      { root: true }
    )
    this.commit(
      'plugin/geometrySearch/setTitleLocationFrequency',
      { [literatureFeature.title]: titleLocationFrequencyChild },
      { root: true }
    )
    this.dispatch('plugin/iconMenu/openMenuById', 'geometrySearch', {
      root: true,
    })
    this.dispatch('plugin/geometrySearch/changeActiveData', null, {
      root: true,
    })
  }

// change if `satisfies` is ever usable on functions
// eslint-disable-next-line func-style
export const selectLiterature: SelectResultFunction<
  GeometrySearchState,
  GeometrySearchState
> = function (
  this: PolarStore<GeometrySearchState, GeometrySearchState>,
  { commit, rootGetters },
  { feature }
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
  const { location_hits_title: headerHits, location_hits_text: bodyHits } = (
    feature as LiteratureFeature
  ).properties

  // NOTE supposed to be calculated in backend in next iteration; then, this is to be dropped
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
    .then(
      processLiteratureToponyms(feature as LiteratureFeature, hits).bind(this)
    )
    .catch(console.error) // search function already printed toasts
}
