// NOTE: The reassignments in the mutations are needed as calling 'add'
//  or 'delete' on the Set does not change the object itself so the getter does
//  not register any changes.

import { PolarModule } from '@polar/lib-custom-types'
import { LoadingIndicatorGetters, LoadingIndicatorState } from '../types'
import getters from './getters'
import { getInitialState } from './state'
import mutations from './mutations'

export const makeStoreModule = () => {
  const storeModule: PolarModule<
    LoadingIndicatorState,
    LoadingIndicatorGetters
  > = {
    namespaced: true,
    state: getInitialState(),
    mutations,
    getters,
    actions: {
      setupModule({ rootGetters, commit }) {
        commit(
          'setLoaderStyle',
          (rootGetters.configuration.loadingIndicator || {}).loaderStyle
        )
      },
    },
  }

  return storeModule
}
