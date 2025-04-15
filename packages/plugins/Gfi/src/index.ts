import { GfiConfiguration } from '@polar/lib-custom-types'
import Vue from 'vue'
import { Gfi } from './components'
import locales from './locales'
import { makeStoreModule } from './store'

export default (options: GfiConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'gfi',
    plugin: Gfi,
    locales,
    storeModule: makeStoreModule(),
    options,
  })
