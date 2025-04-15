import { AttributionsConfiguration } from '@polar/lib-custom-types'
import Vue from 'vue'

import { Attributions } from './components'
import AttributionButton from './components/AttributionButton.vue'
import locales from './locales'
import { makeStoreModule } from './store'

export { AttributionButton }

export default (options: AttributionsConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'attributions',
    plugin: Attributions,
    locales,
    storeModule: makeStoreModule(),
    options,
  })
