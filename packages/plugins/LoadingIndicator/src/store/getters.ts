import { generateSimpleGetters } from '@repositoryname/vuex-generators'
import { PolarGetterTree } from '@polar/lib-custom-types'
import { LoadingIndicatorGetters, LoadingIndicatorState } from '../types'
import { getInitialState } from './state'

const getters: PolarGetterTree<LoadingIndicatorState, LoadingIndicatorGetters> =
  {
    ...generateSimpleGetters(getInitialState()),
    showLoader: ({ loadKeys }) => true,
    loaderStyle(_, __, ___, rootGetters) {
      return (
        (rootGetters.configuration.loadingIndicator || {}).loaderStyle ||
        'v-progress-linear'
      )
    },
  }

export default getters
