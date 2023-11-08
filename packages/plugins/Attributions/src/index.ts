import Vue from 'vue'
import { AttributionsConfiguration } from '@polar/lib-custom-types'

import { Attributions } from './components'
import language from './language'
import storeModule from './store'

export default (options: AttributionsConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'attributions',
    plugin: Attributions,
    language,
    storeModule,
    options,
  })
