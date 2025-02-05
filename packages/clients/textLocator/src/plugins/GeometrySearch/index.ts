import Vue from 'vue'
import { PluginOptions } from '@polar/lib-custom-types'
import { GeometrySearch } from './components'
import locales from './locales'
import { makeStoreModule } from './store'

interface GeometrySearchConfiguration extends PluginOptions {
  url: string
}

export default (options: Partial<GeometrySearchConfiguration>) =>
  (instance: Vue) =>
    instance.$store.dispatch('addComponent', {
      name: 'geometrySearch',
      plugin: GeometrySearch,
      locales,
      storeModule: makeStoreModule(),
      options,
    })
