import Vue from 'vue'
import { AttributionsConfiguration } from '@polar/lib-custom-types'

import { Attributions } from './components'
import locales from './locales'
import { makeStoreModule } from './store'

export default (options: AttributionsConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'attributions',
    plugin: Attributions,
    locales,
    storeModule: makeStoreModule(),
    options,
  })
