import { DrawConfiguration } from '@polar/lib-custom-types'
import Vue from 'vue'

import { Draw } from './components'
import locales from './locales'
import { makeStoreModule } from './store'

export { getSnaps } from './store/createInteractions/getSnaps'
export type { Mode } from './types'

// NOTE: Currently no options are specified here, variable is kept for integrity until options are needed
export default (options: DrawConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'draw',
    plugin: Draw,
    locales,
    storeModule: makeStoreModule(),
    options,
  })
