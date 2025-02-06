import Vue from 'vue'
import { RoutingConfiguration } from '@polar/lib-custom-types'
import { makeStoreModule } from './store'
import { Routing } from './components'
import language from './language'

/**
 * A function that dispatches an action to add the routing component to the Vuex store.
 *
 * This function returns another function that accepts a Vue instance. It dispatches the
 * 'addComponent' action to the store with relevant configuration options such as the
 * routing plugin, language, and the store module.
 *
 * @param options - Configuration options for the routing setup, including language and other routing-related settings.
 * @returns A function that accepts a Vue instance and dispatches the 'addComponent' action to the Vuex store.
 */
export default (options: RoutingConfiguration) => (instance: Vue) => {
  return instance.$store.dispatch('addComponent', {
    name: 'routing',
    plugin: Routing,
    language,
    storeModule: makeStoreModule(),
    options,
  })
}
