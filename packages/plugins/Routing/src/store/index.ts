import { PolarModule } from '@polar/lib-custom-types'
import { RoutingGetters, RoutingState } from '../types'
import { getInitialState } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

/**
 * Creates and returns a Vuex store module with namespacing enabled.
 *
 * The module is initialized with a predefined state, actions, getters, and mutations.
 *
 * @returns A Vuex store module configured with state, actions, getters, and mutations.
 */
export const makeStoreModule = () => {
  const storeModule: PolarModule<RoutingState, RoutingGetters> = {
    namespaced: true,
    state: getInitialState(),
    actions,
    getters,
    mutations,
  }

  return storeModule
}
