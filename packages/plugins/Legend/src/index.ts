import { LegendConfiguration } from '@polar/lib-custom-types'
import Vue from 'vue'

import { Legend } from './components'
import locales from './locales'

export default (options: LegendConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'legend',
    plugin: Legend,
    locales,
    options,
  })
