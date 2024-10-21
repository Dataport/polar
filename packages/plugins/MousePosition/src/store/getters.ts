import { generateSimpleGetters } from '@repositoryname/vuex-generators'
import getInitialState from './getInitialState'

const getters = {
  ...generateSimpleGetters(getInitialState()),
}

export default getters
