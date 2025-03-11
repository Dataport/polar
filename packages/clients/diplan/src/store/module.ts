import { PolarModule } from '@polar/lib-custom-types'
import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import debounce from 'lodash.debounce'
import { Mode } from '@polar/plugin-draw'
import {
  DiplanGetters,
  DiplanState,
  ExtendedDrawMode,
  GeoEditingMode,
} from '../types'
import { drawFeatureCollectionSource, updateState } from './updateState'
import { cutPolygons } from './geoEditing/cutPolygons'
import { duplicatePolygons } from './geoEditing/duplicatePolygons'
import { mergePolygons } from './geoEditing/mergePolygons'

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
    // setup is long, not deep
    // eslint-disable-next-line max-lines-per-function
    setupModule({ dispatch, rootGetters }) {
      const debouncedUpdate = debounce(() => dispatch('updateState'), 50)
      this.watch(
        () => rootGetters[drawFeatureCollectionSource],
        debouncedUpdate
      )
    },
    async trigger({ commit, dispatch }, mode: GeoEditingMode | 'reset') {
      commit('setDrawMode', null)
      dispatch('plugin/draw/setMode', 'none', { root: true })
      if (mode === 'reset') {
        return
      }
      if (mode === 'parcel') {
        // TODO: Implement
        console.error('Not implemented yet.')
      } else if (mode === 'drawPolygon') {
        await dispatch('plugin/draw/setMode', 'draw', { root: true })
        dispatch('plugin/draw/setDrawMode', 'Polygon', { root: true })
      } else if (mode === 'drawCircle') {
        await dispatch('plugin/draw/setMode', 'draw', { root: true })
        dispatch('plugin/draw/setDrawMode', 'Circle', { root: true })
      } else if (mode === 'merge') {
        dispatch('mergePolygons')
      } else if (mode === 'cut') {
        dispatch('cutPolygons')
      } else if (mode === 'lasso') {
        dispatch('plugin/draw/setMode', 'lasso', { root: true })
      } else if (mode === 'edit') {
        // TODO: Implement edit for diplan so that it has both translate and normal edit functionality
        dispatch('plugin/draw/setMode', 'edit', { root: true })
      } else if (mode === 'delete') {
        dispatch('plugin/draw/setMode', 'delete', { root: true })
      }
    },
    cutPolygons,
    duplicatePolygons,
    mergePolygons,
    updateState,
  },
  mutations: {
    ...generateSimpleMutations(getInitialState()),
  },
  getters: {
    ...generateSimpleGetters(getInitialState()),
    configuration: (_, __, ___, rootGetters) => ({
      mergeToMultiGeometries: false,
      validateGeometries: true,
      metaServices: [],
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
