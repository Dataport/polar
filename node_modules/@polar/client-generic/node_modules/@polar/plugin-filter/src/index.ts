import Vue from 'vue'
import { FilterConfiguration } from '@polar/lib-custom-types'
import { Filter } from './components'
import language from './language'
import { makeStoreModule } from './store'

export default (options: FilterConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'filter',
    plugin: Filter,
    language,
    storeModule: makeStoreModule(),
    options,
  })
