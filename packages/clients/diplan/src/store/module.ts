import { PolarModule } from '@polar/lib-custom-types'
import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import debounce from 'lodash.debounce'
import { DiplanGetters, DiplanState } from '../types'
import { drawFeatureCollectionSource, updateState } from './updateState'
import { cutPolygons } from './geoEditing/cutPolygons'
import { duplicatePolygons } from './geoEditing/duplicatePolygons'
import { mergePolygons } from './geoEditing/mergePolygons'

const getInitialState = (): DiplanState => ({
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
      // @ts-expect-error | local override for client
      ...(rootGetters.configuration?.diplan || {}),
    }),
  },
}

export default diplanModule
