import { PolarModule } from '@polar/lib-custom-types'
import { GfiGetters, GfiState } from '../types'

import { makeActions } from './actions'
import getInitialState from './getInitialState'
import getters from './getters'
import mutations from './mutations'

export const makeStoreModule = () => {
  const storeModule: PolarModule<GfiState, GfiGetters> = {
    namespaced: true,
    state: getInitialState(),
    actions: makeActions(),
    mutations,
    getters,
  }

  return storeModule
}
