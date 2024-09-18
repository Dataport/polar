import { LoadingIndicatorState } from '../types'

export const getInitialState = (): LoadingIndicatorState => ({
  loadKeys: new Set(),
  loaderStyle: 'v-progress-linear',
})
