import { PluginOptions } from '@polar/lib-custom-types'
import Vue from 'vue'
import { LoadingIndicator } from './components'
import locales from './locales'
import { makeStoreModule } from './store'

export default (options: PluginOptions) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'loadingIndicator',
    plugin: LoadingIndicator,
    locales,
    storeModule: makeStoreModule(),
    options,
  })
