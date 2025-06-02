import { type PolarModule } from '@polar/lib-custom-types'
import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { type Coordinate } from 'ol/coordinate'
import { RoutingGetters, RoutingState } from '../types'
import { transformCoordinateToWGS84 } from '../utils/routingServiceUtils'
import { getInitialState } from './state'
import actions from './actions'

interface SetRoutePayload {
  index: number
  remove?: boolean
}

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
  namespaced: true,
  state: getInitialState(),
  actions,
  getters: {
    ...generateSimpleGetters(getInitialState()),
    configuration: (_, __, ___, rootGetters) =>
      rootGetters.configuration.routing,
    routeAsWGS84: (_, getters, __, rootGetters) =>
      getters.route.map((coordinate) =>
        transformCoordinateToWGS84(
          coordinate,
          rootGetters.map.getView().getProjection().getCode()
        )
      ),
    /* searchConfiguration: (_, getters) =>
      getters.configuration.searchConfiguration || null, */
    url: (_, getters) =>
      getters.configuration.serviceUrl +
      getters.selectedTravelMode +
      '/' +
      getters.configuration.format,
  },
  mutations: {
    ...generateSimpleMutations(getInitialState()),
    addCoordinateToRoute(state, coordinate: Coordinate) {
      const currentRoute = [...state.route]
      currentRoute[state.currentlyFocusedInput] = coordinate
      state.route = currentRoute
    },
    resetRoute(state) {
      state.route = [[], []]
    },
    setRoute(state, { index, remove }: SetRoutePayload) {
      if (remove) {
        state.route = state.route.toSpliced(index, 1)
        return
      }
      state.route = state.route.toSpliced(index, 0, [])
    },
    updateShowSteps(state) {
      state.showSteps = !state.showSteps
    },
  },
})
