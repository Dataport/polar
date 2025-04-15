import { PointerPositionConfiguration } from '@polar/lib-custom-types'
import Vue from 'vue'
import { PointerPosition } from './components'
import locales from './locales'
import { makeStoreModule } from './store'

export default (options: PointerPositionConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'pointerPosition',
    plugin: PointerPosition,
    storeModule: makeStoreModule(),
    locales,
    options,
  })
