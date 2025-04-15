import { AddressSearchConfiguration } from '@polar/lib-custom-types'
import Vue from 'vue'

import { AddressSearch } from './components'
import SearchContainer from './components/SearchContainer.vue'
import locales from './locales'
import { makeStoreModule } from './store'

import SearchResultSymbols from './utils/searchResultSymbols'
export { SearchContainer, SearchResultSymbols }

export type {
  AddressSearchGetters,
  AddressSearchState,
  BKGParameters,
  MpApiParameters,
} from './types'

export default (options: AddressSearchConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'addressSearch',
    plugin: AddressSearch,
    locales,
    storeModule: makeStoreModule(),
    options,
  })
