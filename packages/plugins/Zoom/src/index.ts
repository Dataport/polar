import Vue from 'vue'
import { ZoomConfiguration } from '@polar/lib-custom-types'
import { Zoom } from './components'
import locales from './locales'
import { makeStoreModule } from './store'

export default (options: ZoomConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'zoom',
    plugin: Zoom,
    locales,
    storeModule: makeStoreModule(),
    options,
  })
