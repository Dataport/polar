import Vue from 'vue'
import { PointerPositionConfiguration } from '@polar/lib-custom-types'
import { PointerPosition } from './components'
import { makeStoreModule } from './store'
import locales from './locales'

export default (options: PointerPositionConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'pointerPosition',
    plugin: PointerPosition,
    storeModule: makeStoreModule(),
    locales,
    options,
  })
