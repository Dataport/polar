import Vue from 'vue'
import { GfiConfiguration } from '@polar/lib-custom-types'
import { Gfi } from './components'
import language from './language'
import { makeStoreModule } from './store'

export default (options: GfiConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'gfi',
    plugin: Gfi,
    language,
    storeModule: makeStoreModule(),
    options,
  })
