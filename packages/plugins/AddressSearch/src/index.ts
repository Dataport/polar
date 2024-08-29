import Vue from 'vue'
import { AddressSearchConfiguration } from '@polar/lib-custom-types'

import { AddressSearch } from './components'
import language from './language'
import { makeStoreModule } from './store'
import { AddressSearchState, AddressSearchGetters } from './types'

export type { AddressSearchState, AddressSearchGetters }

export default (options: AddressSearchConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'addressSearch',
    plugin: AddressSearch,
    language,
    storeModule: makeStoreModule(),
    options,
  })
