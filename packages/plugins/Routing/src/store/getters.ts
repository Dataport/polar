import { generateSimpleGetters } from '@repositoryname/vuex-generators'
import { getInitialState } from './state'

const getters = {
  ...generateSimpleGetters(getInitialState()),
  // TODO: Route zurückgeben, die vom bkg-Dienst geliefert wird
  route: (_, __, ___, rootGetters): string | undefined => {
    return rootGetters.configuration?.routing?.route
  },
}

export default getters
