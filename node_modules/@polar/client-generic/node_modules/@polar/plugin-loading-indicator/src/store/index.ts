// NOTE: The reassignments in the mutations are needed as calling 'add'
//  or 'delete' on the Set does not change the object itself so the getter does
//  not register any changes.

import { PolarModule } from '@polar/lib-custom-types'
import { LoadingIndicatorGetters, LoadingIndicatorState } from '../types'

const getInitialState = (): LoadingIndicatorState => ({
  loadKeys: new Set(),
})

export const makeStoreModule = () => {
  const storeModule: PolarModule<
    LoadingIndicatorState,
    LoadingIndicatorGetters
  > = {
    namespaced: true,
    state: getInitialState(),
    mutations: {
      addLoadingKey(state, key: string) {
        state.loadKeys = new Set([...state.loadKeys, key])
      },
      removeLoadingKey(state, key: string) {
        const loadKeys = new Set(state.loadKeys)
        loadKeys.delete(key)
        state.loadKeys = loadKeys
      },
    },
    getters: {
      showLoader: ({ loadKeys }) => loadKeys.size > 0,
    },
  }

  return storeModule
}
