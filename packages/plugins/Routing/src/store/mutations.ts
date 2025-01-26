import { generateSimpleMutations } from '@repositoryname/vuex-generators'
import { getInitialState } from './state'

const mutations = {
  ...generateSimpleMutations(getInitialState()),
}

export default mutations
