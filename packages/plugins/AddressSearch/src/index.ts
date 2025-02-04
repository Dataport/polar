import Vue from 'vue'
import { AddressSearchConfiguration } from '@polar/lib-custom-types'

import { AddressSearch } from './components'
import locales from './locales'
import { makeStoreModule } from './store'

import SearchResultSymbols from './utils/searchResultSymbols'
export { SearchResultSymbols }

export type {
  AddressSearchState,
  AddressSearchGetters,
  MpApiParameters,
  BKGParameters,
} from './types'

export default (options: AddressSearchConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'addressSearch',
    plugin: AddressSearch,
    locales,
    storeModule: makeStoreModule(),
    options,
  })
