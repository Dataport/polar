import Vue from 'vue'
import { MousePositionConfiguration } from '@polar/lib-custom-types'
import { MousePosition } from './components'
import { makeStoreModule } from './store'
import locales from './locales'

export default (options: MousePositionConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'mousePosition',
    plugin: MousePosition,
    storeModule: makeStoreModule(),
    locales,
    options,
  })
