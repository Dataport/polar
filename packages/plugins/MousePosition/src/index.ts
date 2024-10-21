import Vue from 'vue'
import { MousePositionConfiguration } from '@polar/lib-custom-types'

import { MousePosition } from './components'
import { makeStoreModule } from './store'

export default (options: MousePositionConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'mousePosition',
    plugin: MousePosition,
    storeModule: makeStoreModule(),
    options,
  })
