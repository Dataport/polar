import Vue from 'vue'
import { PluginOptions } from '@polar/lib-custom-types'
import { GeometrySearch } from './components'
import language from './language'
import { makeStoreModule } from './store'

interface GeometrySearchConfiguration extends PluginOptions {
  url: string
}

export default (options: Partial<GeometrySearchConfiguration>) =>
  (instance: Vue) =>
    instance.$store.dispatch('addComponent', {
      name: 'geometrySearch',
      plugin: GeometrySearch,
      language,
      storeModule: makeStoreModule(),
      options,
    })
