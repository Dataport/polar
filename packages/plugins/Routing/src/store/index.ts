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
    locale: 'common:plugins.routing.preference.recommended',
  },
  {
    key: 'fastest',
    locale: 'common:plugins.routing.preference.fastest',
  },
  {
    key: 'shortest',
    locale: 'common:plugins.routing.preference.shortest',
  },
]
const defaultSelectableTravelModes = [
  { key: 'driving-car', locale: 'common:plugins.routing.travelMode.car' },
  { key: 'driving-hgv', locale: 'common:plugins.routing.travelMode.hgv' },
  {
    key: 'cycling-regular',
    locale: 'common:plugins.routing.travelMode.bike',
  },
  {
    key: 'foot-walking',
    locale: 'common:plugins.routing.travelMode.walking',
  },
  {
    key: 'wheelchair',
    locale: 'common:plugins.routing.travelMode.wheelchair',
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
    url: (_, getters) =>
      getters.configuration.serviceUrl +
      getters.selectedTravelMode +
      '/' +
      getters.configuration.format,
  },
  mutations: {
    ...generateSimpleMutations(getInitialState()),
  },
})
