import Vue from 'vue'
import { AddressSearchConfiguration } from '@polar/lib-custom-types'

import { AddressSearch } from './components'
import language from './language'
import { makeStoreModule } from './store'

import SearchResultSymbols from './utils/searchResultSymbols'
export { SearchResultSymbols }

export type {
  AddressSearchState,
  AddressSearchGetters,
  MpApiParameters,
} from './types'

export default (options: AddressSearchConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'addressSearch',
    plugin: AddressSearch,
    language,
    storeModule: makeStoreModule(),
    options,
  })
