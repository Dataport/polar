import { PolarActionTree } from '@polar/lib-custom-types'
import { RoutingState, RoutingGetters } from '../types'

// TODO: <DrawState, DrawGetters> ersetzen
const actions: PolarActionTree<RoutingState, RoutingGetters> = {
  setupModule({ rootGetters: { configuration, map }, commit, getters }) {},
}

export default actions
