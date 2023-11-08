import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { PolarModule } from '@polar/lib-custom-types'
import { ZoomGetters, ZoomState } from '../types'

const getInitialState = (): ZoomState => ({
  zoomLevel: 0,
  maximumZoomLevel: 12,
  minimumZoomLevel: 0,
})

const storeModule: PolarModule<ZoomState, ZoomGetters> = {
  namespaced: true,
  state: getInitialState(),
  actions: {
    setupModule({ rootGetters: { map }, commit, dispatch }) {
      const mapView = map.getView()
      map.on('moveend', () => dispatch('setZoomLevel', mapView.getZoom()))

      dispatch('setZoomLevel', mapView.getZoom())
      commit('setMaximumZoomLevel', mapView.getMaxZoom())
      commit('setMinimumZoomLevel', mapView.getMinZoom())
    },
    setZoomLevel(
      {
        getters: { maximumZoomLevel, minimumZoomLevel, zoomLevel },
        rootGetters: { map },
        commit,
      },
      payload
    ) {
      if (
        payload !== zoomLevel &&
        zoomLevel <= maximumZoomLevel &&
        zoomLevel >= minimumZoomLevel &&
        map
      ) {
        commit('setZoomLevel', payload)
        map.getView().setZoom(payload)
      }
    },
    increaseZoomLevel({ dispatch, getters: { zoomLevel } }): void {
      dispatch('setZoomLevel', zoomLevel + 1)
    },
    decreaseZoomLevel({ dispatch, getters: { zoomLevel } }): void {
      dispatch('setZoomLevel', zoomLevel - 1)
    },
  },
  mutations: {
    ...generateSimpleMutations(getInitialState()),
  },
  getters: {
    ...generateSimpleGetters(getInitialState()),
    maximumZoomLevelActive: (_, { zoomLevel, maximumZoomLevel }): boolean =>
      zoomLevel >= maximumZoomLevel,
    minimumZoomLevelActive: (_, { zoomLevel, minimumZoomLevel }): boolean =>
      zoomLevel <= minimumZoomLevel,
    renderType: (_, __, ___, rootGetters) => {
      return rootGetters?.configuration?.zoom?.renderType
        ? rootGetters?.configuration.zoom.renderType
        : 'independent'
    },
    showMobile: (_, __, ___, rootGetters) =>
      typeof rootGetters?.configuration?.zoom?.showMobile === 'boolean'
        ? rootGetters?.configuration.zoom.showMobile
        : false,
  },
}

export default storeModule
