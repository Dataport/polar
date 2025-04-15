import { PolarModule } from '@polar/lib-custom-types'
import { generateSimpleMutations } from '@repositoryname/vuex-generators'
import { AddressSearchGetters, AddressSearchState } from '../types'
import { makeActions } from './actions'
import getters from './getters'
import { getInitialState } from './state'

export const makeStoreModule = () => {
  const storeModule: PolarModule<AddressSearchState, AddressSearchGetters> = {
    namespaced: true,
    state: getInitialState(),
    actions: makeActions(),
    getters,
    mutations: {
      ...generateSimpleMutations(getInitialState()),
    },
  }

  return storeModule
}
