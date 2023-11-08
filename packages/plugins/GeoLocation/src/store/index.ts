import { generateSimpleMutations } from '@repositoryname/vuex-generators'
import { PolarModule } from '@polar/lib-custom-types'
import { GeoLocationGetters, GeoLocationState } from '../types'
import getInitialState from './getInitialState'
import actions from './actions'
import getters from './getters'

const storeModule: PolarModule<GeoLocationState, GeoLocationGetters> = {
  namespaced: true,
  state: getInitialState(),
  actions,
  getters,
  mutations: {
    ...generateSimpleMutations(getInitialState()),
  },
}

export default storeModule
