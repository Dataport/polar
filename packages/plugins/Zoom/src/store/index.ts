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
      configuration: (_, __, ___, rootGetters) =>
        rootGetters.configuration.zoom || {},
      component: (_, getters) => getters.configuration.component || null,
      icons(_, getters) {
        const icons = getters.configuration.icons
        return {
          zoomIn: icons?.zoomIn ?? 'fa-plus',
          zoomOut: icons?.zoomOut ?? 'fa-minus',
        }
      },
      maximumZoomLevelActive: (_, { zoomLevel, maximumZoomLevel }): boolean =>
        zoomLevel >= maximumZoomLevel,
      minimumZoomLevelActive: (_, { zoomLevel, minimumZoomLevel }): boolean =>
        zoomLevel <= minimumZoomLevel,
      renderType: (_, getters) =>
        getters.configuration.renderType
          ? getters.configuration.renderType
          : 'independent',
      showMobile: (_, getters) =>
        typeof getters.configuration.showMobile === 'boolean'
          ? getters.configuration.showMobile
          : false,
      showZoomSlider: (_, getters) =>
        typeof getters.configuration.showZoomSlider === 'boolean'
          ? getters.configuration.showZoomSlider
          : false,
    },
  }

  return storeModule
}
