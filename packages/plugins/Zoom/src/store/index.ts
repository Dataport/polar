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

// OK for module creation
// eslint-disable-next-line max-lines-per-function
export const makeStoreModule = () => {
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
          dispatch,
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
          dispatch('smoothZoom')
        }
      },
      increaseZoomLevel({ dispatch, getters: { zoomLevel } }): void {
        dispatch('setZoomLevel', zoomLevel + 1)
      },
      decreaseZoomLevel({ dispatch, getters: { zoomLevel } }): void {
        dispatch('setZoomLevel', zoomLevel - 1)
      },
      smoothZoom({ rootGetters: { map }, getters: { zoomLevel } }): void {
        const view = map.getView()
        if (view) {
          view.animate({
            zoom: zoomLevel,
            duration: 500,
          })
        }
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
        return rootGetters.configuration?.zoom?.renderType
          ? rootGetters.configuration.zoom.renderType
          : 'independent'
      },
      showMobile: (_, __, ___, rootGetters) =>
        typeof rootGetters.configuration?.zoom?.showMobile === 'boolean'
          ? rootGetters.configuration.zoom.showMobile
          : false,
      showZoomSlider: (_, __, ___, rootGetters) =>
        typeof rootGetters.configuration?.zoom?.showZoomSlider === 'boolean'
          ? rootGetters.configuration.zoom.showZoomSlider
          : false,
    },
  }

  return storeModule
}
