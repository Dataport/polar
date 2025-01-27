import { generateSimpleGetters } from '@repositoryname/vuex-generators'
import { getInitialState } from './state'

const getters = {
  ...generateSimpleGetters(getInitialState()),
  renderType: (_, __, ___, rootGetters) => {
    return rootGetters.configuration?.routing?.renderType
      ? rootGetters.configuration.routing.renderType
      : 'independent'
  },
}

export default getters
