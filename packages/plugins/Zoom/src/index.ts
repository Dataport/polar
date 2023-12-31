import Vue from 'vue'
import { ZoomConfiguration } from '@polar/lib-custom-types'
import { Zoom } from './components'
import language from './language'
import { makeStoreModule } from './store'

export default (options: ZoomConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'zoom',
    plugin: Zoom,
    language,
    storeModule: makeStoreModule(),
    options,
  })
