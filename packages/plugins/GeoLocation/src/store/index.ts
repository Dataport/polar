import { PolarModule } from '@polar/lib-custom-types'
import { generateSimpleMutations } from '@repositoryname/vuex-generators'
import { GeoLocationGetters, GeoLocationState } from '../types'
import actions from './actions'
import getInitialState from './getInitialState'
import getters from './getters'

export const makeStoreModule = () => {
  const storeModule: PolarModule<GeoLocationState, GeoLocationGetters> = {
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
