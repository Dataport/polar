import { FeatureCollection } from 'geojson'
import { PolarActionContext } from '@polar/lib-custom-types'
import { DiplanGetters, DiplanState, GeometryType } from '../../types'
import { mergeToMultiGeometries } from './mergeToMultiGeometries'
import { validateGeoJson } from './validateGeoJson'
import { enrichWithMetaServices } from './enrichWithMetaServices'

let abortController: AbortController | null = null
export const drawFeatureCollectionSource = 'plugin/draw/featureCollection'

// FeatureCollection is compatible to stupid clone
export const cloneFeatureCollection = (
  // No GeometryCollection from Draw, hence the <GeometryType>
  featureCollection: FeatureCollection<GeometryType>
): FeatureCollection<GeometryType> =>
  JSON.parse(JSON.stringify(featureCollection))

// complexity deemed acceptable, it's mostly chaining
// eslint-disable-next-line max-lines-per-function
export const updateState = async ({
  commit,
  dispatch,
  rootGetters,
  getters,
}: PolarActionContext<DiplanState, DiplanGetters>) => {
  commit('setRevisionInProgress', true)

  if (abortController) {
    abortController.abort()
  }
  const thisController = (abortController = new AbortController())

  // clone to prevent accidentally messing with the draw tool's data
  let revisedFeatureCollection = cloneFeatureCollection(
    rootGetters[drawFeatureCollectionSource]
  )

  // merge first; relevant for both follow-up steps
  if (getters.configuration.mergeToMultiGeometries) {
    revisedFeatureCollection = mergeToMultiGeometries(revisedFeatureCollection)
  }

  // TODO consider from turf:
  // * cleanCoords
  // * union? or even better, combine?
  // * unkinkPolygon?

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
}
