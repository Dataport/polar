import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { PolarModule } from '@polar/lib-custom-types'
import { FullscreenGetters, FullscreenState } from '../types'

export const getInitialState = (): FullscreenState => ({
  isInFullscreen: false,
})

const storeModule: PolarModule<FullscreenState, FullscreenGetters> = {
  namespaced: true,
  state: getInitialState(),
  mutations: {
    ...generateSimpleMutations(getInitialState()),
  },
  getters: {
    ...generateSimpleGetters(getInitialState()),
    renderType: (_, __, ___, rootGetters) => {
      return rootGetters.configuration?.fullscreen?.renderType
        ? rootGetters.configuration.fullscreen.renderType
        : 'independent'
    },
    targetContainerId(_, __, ___, rootGetters) {
      return rootGetters.configuration?.fullscreen?.targetContainerId
        ? rootGetters.configuration?.fullscreen?.targetContainerId
        : ''
    },
  },
}

export default storeModule
