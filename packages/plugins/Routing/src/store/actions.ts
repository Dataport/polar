import { PolarActionTree } from '@polar/lib-custom-types'
import { RoutingState, RoutingGetters } from '../types'

const actions: PolarActionTree<RoutingState, RoutingGetters> = {
  setupModule({ rootGetters: { configuration, map }, commit, getters }) {
    console.error(configuration)
  },
}

// TODO: implementieren: updateTravelMode, updateDisplayPreferredRoute, updatePreferredRoute, updateRouteTypesToAvoid

export default actions
