import { PolarModule } from '@polar/lib-custom-types'
import { GfiGetters, GfiState } from '../types'

import getInitialState from './getInitialState'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const GfiModule: PolarModule<GfiState, GfiGetters> = {
  namespaced: true,
  state: getInitialState(),
  actions,
  mutations,
  getters,
}

export default GfiModule
