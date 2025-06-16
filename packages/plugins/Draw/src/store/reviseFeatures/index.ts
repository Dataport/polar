import type { PolarActionContext } from '@polar/lib-custom-types'
import type { FeatureCollection } from 'geojson'
import type { DrawGetters, DrawState, GeometryType } from '../../types'
import { complete, error, inProgress } from './revisionStates'
import { autofixFeatureCollection } from './autofix'
import { cloneFeatureCollection } from './cloneFeatureCollection'
import { enrichWithMetaServices } from './enrichWithMetaServices'
import { mergeToMultiGeometries } from './mergeToMultiGeometries'
import { validateGeoJson } from './validateGeoJson'

let abortController: AbortController | null = null

export const reviseFeatures = async ({
  commit,
  dispatch,
  rootGetters,
  getters,
}: PolarActionContext<DrawState, DrawGetters>) => {
  const { revision } = getters.configuration
  if (!revision) {
    return
  }

  commit('setFeatureCollectionRevisionState', inProgress)

  if (abortController) {
    abortController.abort()
  }
  const thisController = (abortController = new AbortController())

  // clone to prevent accidentally messing with the draw tool's data
  let revisedFeatureCollection = cloneFeatureCollection(
    getters.featureCollection as FeatureCollection<GeometryType>
  )

  if (revision.autofix) {
    try {
      revisedFeatureCollection = autofixFeatureCollection(
        revisedFeatureCollection
      )
    } catch {
      commit('setFeatureCollectionRevisionState', error)
      console.warn(
        `@polar/plugin-draw: Autofix failed since entered geometries were not valid and fixable. This may e.g. result from pulling points of a polygon in edit mode together until they're point-shaped.`
      )
      return
    }
  }

  // merge first; relevant for both follow-up steps
  if (revision.mergeToMultiGeometries) {
    // TODO: turf provides "union" and "combine" methods, probably just use them
    revisedFeatureCollection = mergeToMultiGeometries(revisedFeatureCollection)
  }

  if (revision.validate) {
    revisedFeatureCollection = validateGeoJson(revisedFeatureCollection)
  }

  if (revision.metaServices?.length) {
    try {
      revisedFeatureCollection.features = await enrichWithMetaServices(
        revisedFeatureCollection,
        rootGetters.map,
        revision.metaServices,
        abortController.signal
      )
    } catch (e) {
      if (thisController.signal.aborted) {
        return
      }
      console.error(
        '@polar/plugin-draw: An error occurred when trying to fetch meta service data for the given feature collection.',
        e
      )
      if (getters.toastAction) {
        dispatch(
          getters.toastAction,
          {
            type: 'warning',
            text: 'plugins.draw.metaInformationRetrieval.errorToast',
            timeout: 10000,
          },
          { root: true }
        )
      }
    }
  }

  if (!thisController.signal.aborted) {
    commit('setRevisedFeatureCollection', revisedFeatureCollection)
    commit('setFeatureCollectionRevisionState', complete)
  }
}
