import { PolarModule } from '@polar/lib-custom-types'
import { GfiGetters, GfiState } from '../types'

import getInitialState from './getInitialState'
import { makeActions } from './actions'
import mutations from './mutations'
import getters from './getters'

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
