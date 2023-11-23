import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { PolarModule } from '@polar/lib-custom-types'
import { FilterGetters, FilterState } from '../types'

const getInitialState = (): FilterState => ({})

const storeModule: PolarModule<FilterState, FilterGetters> = {
  namespaced: true,
  state: getInitialState(),
  actions: {
    setupModule({}): void {
      // TODO decide if setup required at all
    },
  },
  mutations: {
    ...generateSimpleMutations(getInitialState()),
  },
  getters: {
    ...generateSimpleGetters(getInitialState()),
  },
}

export default storeModule
