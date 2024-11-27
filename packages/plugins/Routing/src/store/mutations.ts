import { generateSimpleMutations } from '@repositoryname/vuex-generators'
import { getInitialState } from './state'

const mutations = {
  ...generateSimpleMutations(getInitialState()),
  resetCoordinates(state) {
    state.route = [0.0, 0.0]
  },
}

export default mutations
