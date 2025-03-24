import {
  FeatureCollection,
  Feature as GeoJsonFeature,
  MultiPolygon,
  Polygon,
} from 'geojson'
import { PolarActionContext } from '@polar/lib-custom-types'
import { cleanCoords } from '@turf/clean-coords'
import { unkinkPolygon } from '@turf/unkink-polygon'
import { DiplanGetters, DiplanState, GeometryType } from '../../types'
import { mergeToMultiGeometries } from './mergeToMultiGeometries'
import { validateGeoJson } from './validateGeoJson'
import { enrichWithMetaServices } from './enrichWithMetaServices'

let abortController: AbortController | null = null
export const drawFeatureCollectionSource = 'plugin/draw/featureCollection'

const reviseFeatureCollection = (
  sourceFeatureCollection: FeatureCollection<GeometryType>
) => {
  let revisedFeatureCollection = cloneFeatureCollection(sourceFeatureCollection)

  revisedFeatureCollection = {
    ...revisedFeatureCollection,
    features: revisedFeatureCollection.features.reduce(
      (accumulator, feature) => {
        if (['Polygon', 'MultiPolygon'].includes(feature.geometry.type)) {
          accumulator.push(
            ...unkinkPolygon(
              cleanCoords(feature) as GeoJsonFeature<Polygon | MultiPolygon>
            ).features
          )
        } else {
          accumulator.push(cleanCoords(feature))
        }
        return accumulator
      },
      [] as GeoJsonFeature<GeometryType>[]
    ),
  }

  return revisedFeatureCollection
}

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
  let revisedFeatureCollection
  try {
    revisedFeatureCollection = reviseFeatureCollection(
      rootGetters[drawFeatureCollectionSource]
    )
  } catch {
    // if this revision fails, errors are catastrophic and unfixable
    commit('setSimpleGeometryValidity', false)
    commit('setRevisionInProgress', false)
    return
  }

  // merge first; relevant for both follow-up steps
  if (getters.configuration.mergeToMultiGeometries) {
    // TODO: turf provides "union" and "combine" methods, probably just use them
    revisedFeatureCollection = mergeToMultiGeometries(revisedFeatureCollection)
  }

  if (getters.configuration.validateGeoJson) {
    commit(
      'setSimpleGeometryValidity',
      validateGeoJson(revisedFeatureCollection)
    )
  }

  if (getters.configuration.metaServices.length) {
    try {
      revisedFeatureCollection.features = await enrichWithMetaServices(
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
