import Vue from 'vue'
import { LegendConfiguration } from '@polar/lib-custom-types'

import { Legend } from './components'
import language from './language'

export default (options: LegendConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'legend',
    plugin: Legend,
    language,
    options,
  })
