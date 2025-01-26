import Vue from 'vue'
import { RoutingConfiguration } from '@polar/lib-custom-types' // TODO: Merken: Wird erst nach mergen des PR aktualisiert
import { makeStoreModule } from './store'
import { Routing } from './components'
import language from './language'

export default (options: RoutingConfiguration) => (instance: Vue) => {
  return instance.$store.dispatch('addComponent', {
    name: 'routing',
    plugin: Routing,
    language,
    storeModule: makeStoreModule(),
    options,
  })
}
