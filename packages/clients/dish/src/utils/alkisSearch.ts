import { Feature } from 'geojson'
import {
  CoreGetters,
  CoreState,
  PolarStore,
  SelectResultFunction,
} from '@polar/lib-custom-types'
import {
  SearchResultSymbols,
  AddressSearchGetters,
  AddressSearchState,
} from '@polar/plugin-address-search'
import { WfsParameters, getWfsFeatures } from '@polar/lib-get-features'

export function alkisSearch(
  this: PolarStore<CoreState, CoreGetters>,
  signal: AbortSignal,
  url: string,
  inputValue: string,
  queryParameters: WfsParameters
) {
  const searchString = inputValue[0].toUpperCase() + inputValue.slice(1)
  return getWfsFeatures(signal, url, `${searchString}*`, queryParameters)
}

export const alkisSearchResult: SelectResultFunction<
  AddressSearchState,
  AddressSearchGetters
> = (
  { commit },
  {
    feature,
  }: {
    feature: Feature & {
      title: string
      epsg?: string
    }
  }
) => {
  console.log('Alkis selected feature:', feature)
  commit('setChosenAddress', feature)
  commit('setInputValue', feature.title)
  commit('setSearchResults', SearchResultSymbols.NO_SEARCH)
}
