import Vue from 'vue'
import { PluginOptions } from '@polar/lib-custom-types'

import { Legend } from './components'
import locales from './locales'

export default (options: PluginOptions) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'legend',
    plugin: Legend,
    locales,
    options,
  })
