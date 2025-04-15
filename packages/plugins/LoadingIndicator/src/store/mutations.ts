import { LoaderStyles } from '@polar/lib-custom-types'
import { generateSimpleMutations } from '@repositoryname/vuex-generators'
import { LoadingIndicatorMutations } from '../types'
import { getInitialState } from './state'
const styles = [
  'CircleLoader',
  'BasicLoader',
  'none',
  'RingLoader',
  'RollerLoader',
  'SpinnerLoader',
  'v-progress-linear',
]

const mutations: LoadingIndicatorMutations = {
  ...generateSimpleMutations(getInitialState()),
  setLoaderStyle(state, style?: LoaderStyles) {
    if (style) {
      if (styles.includes(style)) {
        state.loaderStyle = style
      } else {
        console.error(
          `@polar/plugin-loading-indicator: loader style ${style} does not exist. Falling back to default.`
        )
      }
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
}

export default mutations
