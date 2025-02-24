import { PolarModule } from '@polar/lib-custom-types'
import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { FeatureCollection } from 'geojson'
import { DiplanGetters, DiplanState } from '../types'
import { mergeMultiGeometries } from './utils/mergeMultiGeometries'
import { validateGeoJson } from './utils/validateGeoJson'
import { enrichWithMetaServices } from './utils/enrichWithMetaServices'

const drawFeatureCollection = 'plugin/draw/featureCollection'

// FeatureCollection is compatible to stupid clone
const cloneFeatureCollection = (
  featureCollection: FeatureCollection
): FeatureCollection => JSON.parse(JSON.stringify(featureCollection))

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
      this.watch(
        () => rootGetters[drawFeatureCollection],
        () => dispatch('updateState')
      )
    },
    updateState: async ({ commit, dispatch, rootGetters, getters }) => {
      commit('setRevisionInProgress', true)

      // clone to prevent accidentally messing with the draw tool's data
      let revisedFeatureCollection = cloneFeatureCollection(
        rootGetters[drawFeatureCollection]
      )

      // merge first; relevant for both follow-up steps
      if (getters.configuration.mergeMultiGeometries) {
        revisedFeatureCollection = mergeMultiGeometries(
          revisedFeatureCollection
        )
      }

      if (getters.configuration.validateGeoJson) {
        commit(
          'setSimpleGeometryValidity',
          validateGeoJson(revisedFeatureCollection)
        )
      }

      if (getters.configuration.metaServices.length) {
        try {
          await enrichWithMetaServices(
            revisedFeatureCollection,
            rootGetters.map,
            getters.configuration.metaServices
          )
        } catch (e) {
          console.error(
            '@polar/client-diplan: An error occured when trying to fetch meta service data for the given feature collection.',
            e
          )
          dispatch(
            'plugin/toast/addToast',
            {
              type: 'warning',
              text: 'diplan.error.metaInformationRetrieval',
              timeout: 10000,
            },
            { root: true }
          )
        }
      }

      commit('setRevisedDrawExport', revisedFeatureCollection)
      commit('setRevisionInProgress', false)
    },
  },
  mutations: {
    ...generateSimpleMutations(getInitialState()),
  },
  getters: {
    ...generateSimpleGetters(getInitialState()),
    configuration: (_, __, ___, rootGetters) => ({
      mergeMultiGeometries: false,
      validateGeometries: true,
      metaServices: [],
      // @ts-expect-error | local override for client
      ...(rootGetters.configuration?.diplan || {}),
    }),
  },
}

export default diplanModule
