import Vue from 'vue'
import { FilterConfiguration } from '@polar/lib-custom-types'
import { Filter } from './components'
import language from './language'
import storeModule from './store'

export default (options: FilterConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'Filter',
    plugin: Filter,
    language,
    storeModule,
    options,
  })
