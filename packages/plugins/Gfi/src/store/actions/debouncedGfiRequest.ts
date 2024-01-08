import { rawLayerList } from '@masterportal/masterportalapi/src'
import { Coordinate } from 'ol/coordinate'
import { Feature as GeoJsonFeature } from 'geojson'
import {
  GfiFeatureInformation,
  PolarActionContext,
} from '@polar/lib-custom-types'
import { Layer, Vector } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import { addFeature } from '../../utils/displayFeatureLayer'
import { requestGfi } from '../../utils/requestGfi'
import sortFeatures from '../../utils/sortFeatures'
import { GfiGetters, GfiState } from '../../types'

interface DebouncedGfiRequestPayload {
  coordinate: Coordinate
  featureDisplayLayer: Vector<VectorSource>
}

interface RequestFeaturePayload {
  coordinate: Coordinate
  layerId: string
}

export function requestFeature(
  { rootGetters }: PolarActionContext<GfiState, GfiGetters>,
  { coordinate, layerId }: RequestFeaturePayload
): Promise<GeoJsonFeature[]> {
  const { configuration, map } = rootGetters
  const layer = map
    .getLayers()
    .getArray()
    .find((layer) => layer.getProperties().id === layerId)

  if (!(layer instanceof Layer)) {
    console.error(
      `No layer with id "${layerId}" found during run-time. GFI skipped.`
    )
    return Promise.resolve([] as GeoJsonFeature[])
  }

  const layerConfiguration = configuration.gfi?.layers[layerId] || {}
  const layerSpecification = rawLayerList.getLayerWhere({ id: layerId })
  const mainLayerConfiguration = configuration.layers.find(
    (element) => element.id === layerId
  )
  const layerGfiMode =
    mainLayerConfiguration?.gfiMode || configuration.gfi?.mode || 'bboxDot'

  return requestGfi({
    map,
    layer,
    coordinate,
    layerConfiguration,
    layerSpecification,
    mode: layerGfiMode,
  })
}

export async function mapFeaturesToLayer(
  {
    rootGetters: { configuration, map },
    getters: { layerKeys, afterLoadFunction },
  }: PolarActionContext<GfiState, GfiGetters>,
  features: (symbol | GeoJsonFeature[])[]
): Promise<GfiFeatureInformation> {
  const srsName = map.getView().getProjection().getCode()
  const generalMaxFeatures: number =
    configuration.gfi?.maxFeatures || Number.POSITIVE_INFINITY

  let featuresByLayerId = layerKeys.reduce(
    (accumulator, key, index) => ({
      ...accumulator,
      [key]: Array.isArray(features[index])
        ? (features[index] as []).slice(
            0,
            configuration.gfi?.layers[key]?.maxFeatures || generalMaxFeatures
          )
        : features[index],
    }),
    {}
  )
  featuresByLayerId = Object.entries(featuresByLayerId).reduce(
    (accumulator, [layerKey, layerValues]) => ({
      ...accumulator,
      [layerKey]:
        Array.isArray(layerValues) && layerValues.length >= 2
          ? layerValues.sort((a, b) => sortFeatures(a, b, srsName))
          : layerValues,
    }),
    {}
  )

  // store features in state, if configured via client specific function
  if (typeof afterLoadFunction === 'function') {
    featuresByLayerId = await afterLoadFunction(featuresByLayerId, srsName)
  }
  return featuresByLayerId
}

/**
 * Code from `getFeatureInfo`, pulled to avoid overly requesting feature
 * information. Since sources in Pins plugin update right after each other
 * (and such effects are to be expected across the system), we're debouncing
 * this *after* resetting the module state, as something is bound to happen.
 */
export async function debouncedGfiRequest(
  {
    commit,
    dispatch,
    getters: { layerKeys, geometryLayerKeys },
  }: PolarActionContext<GfiState, GfiGetters>,
  { coordinate, featureDisplayLayer }: DebouncedGfiRequestPayload
): Promise<void> {
  // fetch new feature information for all configured layers
  const promisedFeatures = layerKeys.map((key) =>
    dispatch('requestFeature', { coordinate, layerId: key })
  )

  const errorSymbol = (err: string) => Symbol(err)
  const features = (await Promise.allSettled(promisedFeatures)).map((result) =>
    result.status === 'fulfilled'
      ? result.value
      : errorSymbol(result.reason.message)
  )

  const featuresByLayerId = dispatch('mapFeaturesToLayer', features)
  commit('setFeatureInformation', featuresByLayerId)

  // render feature geometries to help layer
  geometryLayerKeys
    .filter((key) => Array.isArray(featuresByLayerId[key]))
    .forEach((key) =>
      // Symbols are filtered before calling forEach
      (featuresByLayerId[key] as GeoJsonFeature[]).forEach((feature) =>
        addFeature(feature, featureDisplayLayer)
      )
    )
}
