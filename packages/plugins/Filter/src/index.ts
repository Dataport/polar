import { FilterConfiguration } from '@polar/lib-custom-types'
import Vue from 'vue'
import { Filter } from './components'
import locales from './locales'
import { makeStoreModule } from './store'

export default (options: FilterConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'filter',
    plugin: Filter,
    locales,
    storeModule: makeStoreModule(),
    options,
  })
