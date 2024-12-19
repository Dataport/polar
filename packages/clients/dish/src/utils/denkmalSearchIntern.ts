import { SelectResultFunction } from '@polar/lib-custom-types'
import {
  SearchResultSymbols,
  AddressSearchGetters,
  AddressSearchState,
} from '@polar/plugin-address-search'
import { Feature, GeoJsonProperties, Geometry } from 'geojson'

export const denkmalSearchResult: SelectResultFunction<
  AddressSearchState,
  AddressSearchGetters
> = (
  { commit },
  {
    feature,
  }: {
    feature: Feature<Geometry, GeoJsonProperties> & {
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
