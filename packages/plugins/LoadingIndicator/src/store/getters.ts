import { PolarGetterTree } from '@polar/lib-custom-types'
import { generateSimpleGetters } from '@repositoryname/vuex-generators'
import { LoadingIndicatorGetters, LoadingIndicatorState } from '../types'
import { getInitialState } from './state'

const getters: PolarGetterTree<LoadingIndicatorState, LoadingIndicatorGetters> =
  {
    ...generateSimpleGetters(getInitialState()),
    showLoader: ({ loadKeys }) => loadKeys.size > 0,
  }

export default getters
