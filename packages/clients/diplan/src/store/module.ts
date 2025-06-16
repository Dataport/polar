import { PolarModule } from '@polar/lib-custom-types'
import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { Mode } from '@polar/plugin-draw'
import {
  DiplanGetters,
  DiplanState,
  ExtendedDrawMode,
  GeoEditingMode,
} from '../types'

const getInitialState = (): DiplanState => ({
  drawMode: null,
  revisionInProgress: false,
  simpleGeometryValidity: true,
  revisedDrawExport: { type: 'FeatureCollection', features: [] },
})

/*
 * DiPlan VueX Store Module.
 * This serves as an interface for systems using this client.
 */
const diplanModule: PolarModule<DiplanState, DiplanGetters> = {
  namespaced: true,
  state: getInitialState(),
  actions: {
    async trigger({ commit, dispatch }, mode: GeoEditingMode | 'reset') {
      commit('setDrawMode', null)
      dispatch('plugin/draw/setMode', 'none', { root: true })
      if (mode === 'reset') {
        return
      }
      if (mode === 'drawPolygon') {
        await dispatch('plugin/draw/setMode', 'draw', { root: true })
        dispatch('plugin/draw/setDrawMode', 'Polygon', { root: true })
      } else if (mode === 'drawCircle') {
        await dispatch('plugin/draw/setMode', 'draw', { root: true })
        dispatch('plugin/draw/setDrawMode', 'Circle', { root: true })
      } else if (mode === 'merge') {
        dispatch('plugin/draw/setMode', 'merge', { root: true })
      } else if (mode === 'cut') {
        dispatch('plugin/draw/setMode', 'cut', { root: true })
      } else if (mode === 'duplicate') {
        dispatch('plugin/draw/setMode', 'duplicate', { root: true })
      } else if (mode === 'lasso') {
        dispatch('plugin/draw/setMode', 'lasso', { root: true })
      } else if (mode === 'edit') {
        dispatch('plugin/draw/setMode', 'edit', { root: true })
      } else if (mode === 'translate') {
        dispatch('plugin/draw/setMode', 'translate', { root: true })
      } else if (mode === 'delete') {
        dispatch('plugin/draw/setMode', 'delete', { root: true })
      }
    },
    updateDrawMode({ dispatch, commit }, drawMode) {
      // always reset draw plugin before starting something
      dispatch('plugin/draw/setMode', 'none', { root: true })
      commit('setDrawMode', drawMode)
    },
  },
  mutations: {
    ...generateSimpleMutations(getInitialState()),
  },
  getters: {
    ...generateSimpleGetters(getInitialState()),
    configuration: (_, __, ___, rootGetters) => ({
      renderType: 'iconMenu',
      // @ts-expect-error | local override for client
      ...(rootGetters.configuration?.diplan || {}),
    }),
    // meant for internal usage in UI
    activeDrawMode: (_, getters, ___, rootGetters): ExtendedDrawMode =>
      getters.drawMode ?? (rootGetters['plugin/draw/mode'] as Mode),
  },
}

export default diplanModule
