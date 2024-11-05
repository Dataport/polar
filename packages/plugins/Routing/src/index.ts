import Vue from 'vue'
import { RoutingConfiguration } from '@polar/lib-custom-types'
import { makeStoreModule } from './store'
import { Routing } from './components'
import language from './language'

export default (options: RoutingConfiguration) => (instance: Vue) => {
  console.error('mol kieken', options)
  return instance.$store.dispatch('addComponent', {
    name: 'routing',
    plugin: Routing,
    language,
    storeModule: makeStoreModule(),
    options,
  })
}
