import { FeatureCollection } from 'geojson'
import { Map } from 'ol'
import { Store } from 'vuex'
import { CoreState, SelectResultFunction } from '@polar/lib-custom-types'
import SearchResultSymbols from '@polar/plugin-address-search/src/utils/searchResultSymbols'
import { ResponsePayload } from './types'
import { getAllPages } from './getAllPages'
import {
  getEmptyFeatureCollection,
  featureCollectionify,
} from './responseInterpreter'

interface CoastalGazetteerParameters {
  epsg: `EPSG:${string}`
  map: Map
}

// this method is meant to be injected into the AddressSearch plugin
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
    if (!signal.aborted) {
      console.error(e)
      this.dispatch('plugin/toast/addToast', {
        type: 'error',
        text: 'textLocator.error.searchCoastalGazetteer',
      })
    }
    return getEmptyFeatureCollection()
  }
  return Promise.resolve(
    featureCollectionify(fullResponse, queryParameters.epsg, inputValue)
  )
}

export const selectResult: SelectResultFunction = ({ commit }, { feature }) => {
  // default behaviour (AddressSearch selects and is out further behaviour)
  commit('plugin/addressSearch/setChosenAddress', feature, { root: true })
  commit('plugin/addressSearch/setInputValue', feature.title, { root: true })
  commit(
    'plugin/addressSearch/setSearchResults',
    SearchResultSymbols.NO_SEARCH,
    { root: true }
  )

  // added behaviour: push as one-element feature collection to search store
  commit('plugin/geometrySearch/setByCategory', 'toponym', { root: true })
  commit(
    'plugin/geometrySearch/setFeatureCollection',
    {
      ...getEmptyFeatureCollection(),
      features: [feature],
    },
    { root: true }
  )
}
