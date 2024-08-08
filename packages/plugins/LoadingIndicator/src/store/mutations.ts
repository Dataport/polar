import { generateSimpleMutations } from '@repositoryname/vuex-generators'
import { getInitialState } from './state'
import { loaderStyles } from '@polar/lib-custom-types'
import { LoadingIndicatorMutations } from '../types'

const mutations = {
  ...generateSimpleMutations(getInitialState()),
  setLoaderStyle(state, style: string) {
    if (style && loaderStyles.hasOwnProperty(style)) {
      state.loaderStyle = style
    } else {
      console.error(`@polar/LoadingIndicator: loader style ${style} does not exist. Falling back to default.`)
    }
  },
  addLoadingKey(state, key: string) {
    state.loadKeys = new Set([...state.loadKeys, key])
  },
  removeLoadingKey(state, key: string) {
    const loadKeys = new Set(state.loadKeys)
    loadKeys.delete(key)
    state.loadKeys = loadKeys
  },
} as LoadingIndicatorMutations

export default mutations
