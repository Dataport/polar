import { type PolarModule } from '@polar/lib-custom-types'
import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { RoutingGetters, RoutingState } from '../types'
import { getInitialState } from './state'
import actions from './actions'

const defaultSelectablePreferences = [
  {
    key: 'recommended',
    localKey: 'common:plugins.routing.preference.recommended',
  },
  {
    key: 'fastest',
    localKey: 'common:plugins.routing.preference.fastest',
  },
  {
    key: 'shortest',
    localKey: 'common:plugins.routing.preference.shortest',
  },
]
const defaultSelectableTravelModes = [
  { key: 'driving-car', localKey: 'common:plugins.routing.travelMode.car' },
  { key: 'driving-hgv', localKey: 'common:plugins.routing.travelMode.hgv' },
  {
    key: 'cycling-regular',
    localKey: 'common:plugins.routing.travelMode.bike',
  },
  {
    key: 'foot-walking',
    localKey: 'common:plugins.routing.travelMode.walking',
  },
  {
    key: 'wheelchair',
    localKey: 'common:plugins.routing.travelMode.wheelchair',
  },
]

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
    selectablePreferences: (_, getters) =>
      getters.configuration.selectableTravelModes.length
        ? getters.configuration.selectablePreferences
        : defaultSelectablePreferences,
    selectableTravelModes: (_, getters) =>
      getters.configuration.selectableTravelModes.length
        ? getters.configuration.selectableTravelModes
        : defaultSelectableTravelModes,
  },
  mutations: {
    ...generateSimpleMutations(getInitialState()),
  },
})
