import { generateSimpleMutations } from '@repositoryname/vuex-generators'
import { PolarModule } from '@polar/lib-custom-types'
import { AddressSearchGetters, AddressSearchState } from '../types'
import actions from './actions'
import getters from './getters'
import { getInitialState } from './state'

const storeModule: PolarModule<AddressSearchState, AddressSearchGetters> = {
  namespaced: true,
  state: getInitialState(),
  actions,
  getters,
  mutations: {
    ...generateSimpleMutations(getInitialState()),
  },
}

export default storeModule
