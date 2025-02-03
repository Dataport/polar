import { PolarModule } from '@polar/lib-custom-types'
import { RoutingGetters, RoutingState } from '../types'
import { getInitialState } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

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
