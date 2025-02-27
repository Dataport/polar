import { PolarModule } from '@polar/lib-custom-types'
import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { FeatureCollection } from 'geojson'
import debounce from 'lodash.debounce'
import { DiplanGetters, DiplanState, GeometryType } from '../types'
import { mergeToMultiGeometries } from './utils/mergeToMultiGeometries'
import { validateGeoJson } from './utils/validateGeoJson'
import { enrichWithMetaServices } from './utils/enrichWithMetaServices'

let abortController: AbortController | null = null
const drawFeatureCollection = 'plugin/draw/featureCollection'

// FeatureCollection is compatible to stupid clone
const cloneFeatureCollection = (
  // No GeometryCollection from Draw, hence the <GeometryType>
  featureCollection: FeatureCollection<GeometryType>
): FeatureCollection<GeometryType> =>
  JSON.parse(JSON.stringify(featureCollection))

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
      this.watch(() => rootGetters[drawFeatureCollection], debouncedUpdate)
    },
    // complexity deemed acceptable, it's mostly chaining
    // eslint-disable-next-line max-lines-per-function
    updateState: async ({ commit, dispatch, rootGetters, getters }) => {
      commit('setRevisionInProgress', true)

      if (abortController) {
        abortController.abort()
      }
      const thisController = (abortController = new AbortController())

      // clone to prevent accidentally messing with the draw tool's data
      let revisedFeatureCollection = cloneFeatureCollection(
        rootGetters[drawFeatureCollection]
      )

      // merge first; relevant for both follow-up steps
      if (getters.configuration.mergeToMultiGeometries) {
        revisedFeatureCollection = mergeToMultiGeometries(
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
            getters.configuration.metaServices,
            abortController.signal
          )
        } catch (e) {
          if (thisController.signal.aborted) {
            return
          }
          console.error(
            '@polar/client-diplan: An error occurred when trying to fetch meta service data for the given feature collection.',
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

      if (!thisController.signal.aborted) {
        commit('setRevisedDrawExport', revisedFeatureCollection)
        commit('setRevisionInProgress', false)
      }
    },
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
