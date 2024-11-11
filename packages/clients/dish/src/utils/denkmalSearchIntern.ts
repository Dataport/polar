import { SelectResultFunction } from '@polar/lib-custom-types'
import {
  SearchResultSymbols,
  AddressSearchGetters,
  AddressSearchState,
} from '@polar/plugin-address-search'

export const denkmalSearchResult: SelectResultFunction<
  AddressSearchState,
  AddressSearchGetters
> = ({ commit }, { feature }) => {
  feature.epsg = 'EPSG:25832'
  commit('setChosenAddress', feature)
  commit('setInputValue', feature.title)
  commit('setSearchResults', SearchResultSymbols.NO_SEARCH)
}
