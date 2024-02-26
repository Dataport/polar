import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { PolarModule } from '@polar/lib-custom-types'
import { GeometrySearchState, GeometrySearchGetters } from '../types'

const getInitialState = (): GeometrySearchState => ({})

// OK for module creation
// eslint-disable-next-line max-lines-per-function
export const makeStoreModule = () => {
  const storeModule: PolarModule<GeometrySearchState, GeometrySearchGetters> = {
    namespaced: true,
    state: getInitialState(),
    actions: {
      setupModule({
        commit,
        dispatch,
        getters: { listenToChanges, renderType },
        rootGetters,
      }): void {},
    },
    mutations: {
      ...generateSimpleMutations(getInitialState()),
    },
    getters: {
      ...generateSimpleGetters(getInitialState()),
    },
  }

  return storeModule
}
