import { PolarStore, SelectResultFunction } from '@polar/lib-custom-types'
import {
  AddressSearchGetters,
  AddressSearchState,
  SearchResultSymbols,
} from '@polar/plugin-address-search'
import { FeatureCollection } from 'geojson'
import { Map } from 'ol'
import VectorSource from 'ol/source/Vector'
import {
  GeometrySearchGetters,
  GeometrySearchState,
} from '../../plugins/GeometrySearch/types'
import { getAllPages } from './getAllPages'
import {
  featureCollectionify,
  getEmptyFeatureCollection,
} from './responseInterpreter'
import { ResponsePayload } from './types'

interface CoastalGazetteerParameters {
  epsg: `EPSG:${string}`
  map: Map
}

// this method is meant to be injected into the AddressSearch plugin
export async function searchCoastalGazetteerByToponym(
  this: PolarStore<GeometrySearchState, GeometrySearchGetters>,
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
    if (!signal.aborted) {
      console.error('@polar/client-text-locator', e)
      this.dispatch('plugin/toast/addToast', {
        type: 'error',
        text: 'textLocator.error.search',
      })
    }
    return getEmptyFeatureCollection()
  }
  return Promise.resolve(
    featureCollectionify(fullResponse, queryParameters.epsg, inputValue)
  )
}

export const selectResult: SelectResultFunction<
  AddressSearchState,
  AddressSearchGetters
> = ({ commit, dispatch, rootGetters }, { feature }) => {
  // default behaviour (AddressSearch selects and is not involved in further behaviour)
  commit('plugin/addressSearch/setChosenAddress', feature, { root: true })
  commit('plugin/addressSearch/setInputValue', feature.title, { root: true })
  commit(
    'plugin/addressSearch/setSearchResults',
    SearchResultSymbols.NO_SEARCH,
    { root: true }
  )
  const drawSource = rootGetters['plugin/draw/drawSource'] as VectorSource
  drawSource.clear()

  // added behaviour: push as one-element feature collection to search store
  commit(
    'plugin/geometrySearch/setFeatureCollection',
    {
      ...getEmptyFeatureCollection(),
      features: [feature],
    },
    { root: true }
  )
  dispatch('plugin/geometrySearch/updateFrequencies', null, { root: true })
  commit('plugin/geometrySearch/setLastSearch', 'toponymSearch', { root: true })
}
