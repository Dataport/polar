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

function replaceUmlauts(input: string): string {
  return input
    .replace(/Ä/g, 'AE')
    .replace(/Ö/g, 'OE')
    .replace(/Ü/g, 'UE')
    .replace(/ß/g, 'SS')
}

export function badestellenSearch(
  this: PolarStore<CoreState, CoreGetters>,
  signal: AbortSignal,
  url: string,
  inputValue: string,
  queryParameters: WfsParameters
) {
  const searchString = replaceUmlauts(inputValue.toUpperCase())
  return getWfsFeatures(signal, url, `*${searchString}*`, queryParameters)
}

export const badestellenSearchResult: SelectResultFunction<
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
  feature.epsg = 'EPSG:25832'
  commit('setChosenAddress', feature)
  commit('setInputValue', feature.title)
  commit('setSearchResults', SearchResultSymbols.NO_SEARCH)
}
