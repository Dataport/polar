import { generateSimpleGetters } from '@repositoryname/vuex-generators'
import { getInitialState } from './state'

/**
 * Defines Vuex getters for the routing module.
 *
 * - Includes automatically generated simple getters based on the initial state.
 */
const getters = {
  ...generateSimpleGetters(getInitialState()),
}

export default getters
