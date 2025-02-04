import { generateSimpleGetters } from '@repositoryname/vuex-generators'
import { getInitialState } from './state'

/**
 * Defines Vuex getters for the routing module.
 *
 * - Includes automatically generated simple getters based on the initial state.
 * - Provides a custom getter 'renderType', which retrieves the 'renderType'
 *   from the 'configuration.routing' state in the root Vuex store.
 *   If not defined, it defaults to 'independent'.
 */
const getters = {
  ...generateSimpleGetters(getInitialState()),
  renderType: (_, __, ___, rootGetters) => {
    return rootGetters.configuration?.routing?.renderType
      ? rootGetters.configuration.routing.renderType
      : 'independent'
  },
}

export default getters
