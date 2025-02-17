import { SelectResultFunction } from '@polar/lib-custom-types'
import {
  SearchResultSymbols,
  AddressSearchGetters,
  AddressSearchState,
} from '@polar/plugin-address-search'
import { Feature } from 'geojson'

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
