import {
  LoadingIndicatorConfiguration,
} from '@polar/lib-custom-types'

export interface LoadingIndicatorState {
  loadKeys: Set<string>
}

export interface LoadingIndicatorGetters {
  showLoader: boolean
  loaderStyle: LoadingIndicatorConfiguration['loaderStyle']
}
