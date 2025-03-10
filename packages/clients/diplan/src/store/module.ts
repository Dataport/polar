import { PolarModule } from '@polar/lib-custom-types'
import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import debounce from 'lodash.debounce'
import { Mode } from '@polar/plugin-draw'
import { DiplanGetters, DiplanState, ExtendedDrawMode } from '../types'
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
    setupModule({ dispatch, rootGetters }) {
      const debouncedUpdate = debounce(() => dispatch('updateState'), 50)
      this.watch(
        () => rootGetters[drawFeatureCollectionSource],
        debouncedUpdate
      )
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
