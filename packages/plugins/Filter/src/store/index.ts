import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { FilterConfiguration, PolarModule } from '@polar/lib-custom-types'
import { FilterGetters, FilterState } from '../types'

const getInitialState = (): FilterState => ({})

const storeModule: PolarModule<FilterState, FilterGetters> = {
  namespaced: true,
  state: getInitialState(),
  actions: {
    setupModule(): void {
      // TODO decide if setup required at all
      // NOTE probably to get active layers :thinking:
    },
  },
  mutations: {
    ...generateSimpleMutations(getInitialState()),
  },
  getters: {
    ...generateSimpleGetters(getInitialState()),
    filterConfiguration(_, __, ___, rootGetters): FilterConfiguration {
      return rootGetters.configuration?.filter || { layers: {} }
    },
  },
}

export default storeModule
