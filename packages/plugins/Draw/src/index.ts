import Vue from 'vue'
import { DrawConfiguration } from '@polar/lib-custom-types'

import { Draw } from './components'
import language from './language'
import storeModule from './store'

// NOTE: Currently no options are specified here, variable is kept for integrity until options are needed
export default (options: DrawConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'draw',
    plugin: Draw,
    language,
    storeModule,
    options,
  })
