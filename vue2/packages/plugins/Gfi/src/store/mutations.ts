import { generateSimpleMutations } from '@repositoryname/vuex-generators'
import getInitialState from './getInitialState'

const mutations = {
  ...generateSimpleMutations(getInitialState()),
  clearFeatureInformation(state) {
    state.featureInformation = {}
  },
}

export default mutations
