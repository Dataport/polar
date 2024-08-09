import { LoaderStyles } from '@polar/lib-custom-types'
import { LoadingIndicatorState } from '../types'

export const getInitialState = (): LoadingIndicatorState => ({
  loadKeys: new Set(),
  loaderStyle: LoaderStyles.vProgressLinear,
})
