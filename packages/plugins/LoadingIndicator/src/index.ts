import Vue from 'vue'
import { PluginOptions } from '@polar/lib-custom-types'
import { LoadingIndicator } from './components'
import language from './language'
import storeModule from './store'

export default (options: PluginOptions) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'loadingIndicator',
    plugin: LoadingIndicator,
    language,
    storeModule,
    options,
  })
