import { generateSimpleMutations } from '@repositoryname/vuex-generators'
import { PolarModule } from '@polar/lib-custom-types'
import { RoutingGetters, RoutingState } from '../types'
import { getInitialState } from './state'
import actions from './actions'
import getters from './getters'

export const makeStoreModule = () => {
  const storeModule: PolarModule<RoutingState, RoutingGetters> = {
    namespaced: true,
    state: getInitialState(),
    actions,
    getters,
    mutations: {
      ...generateSimpleMutations(getInitialState()),
    },
  }

  return storeModule
}
