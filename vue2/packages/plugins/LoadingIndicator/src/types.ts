import { LoaderStyles } from '@polar/lib-custom-types'
import { Mutation, MutationTree } from 'vuex'

export interface LoadingIndicatorState {
  loadKeys: Set<string>
  loaderStyle: LoaderStyles
}

export interface LoadingIndicatorGetters {
  showLoader: boolean
  loaderStyle: LoaderStyles
}

export interface LoadingIndicatorMutations
  extends MutationTree<LoadingIndicatorState> {
  setLoaderStyle: Mutation<LoadingIndicatorState>
  addLoadingKey: Mutation<LoadingIndicatorState>
  removeLoadingKey: Mutation<LoadingIndicatorState>
}
