import { type PolarModule } from '@polar/lib-custom-types'
import { generateSimpleGetters } from '@repositoryname/vuex-generators'
import { RoutingGetters, RoutingState } from '../types'
import { getInitialState } from './state'

/**
 * Creates and returns a Vuex store module with namespacing enabled.
 *
 * The module is initialized with a predefined state, actions, getters, and mutations.
 *
 * @returns A Vuex store module configured with state, actions, getters, and mutations.
 */
export const makeStoreModule = (): PolarModule<
	RoutingState,
	RoutingGetters
> => ({
	getters: {
		...generateSimpleGetters(getInitialState()),
		/* searchConfiguration: (_, getters) =>
      getters.configuration.searchConfiguration || null, */
	},
})
