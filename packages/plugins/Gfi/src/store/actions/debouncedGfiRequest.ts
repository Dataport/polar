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

/**
 * Code from `getFeatureInfo`, pulled to avoid overly requesting feature
 * information. Since sources in Pins plugin update right after each other
 * (and such effects are to be expected across the system), we're debouncing
 * this *after* resetting the module state, as something is bound to happen.
 */
export default async function (
  {
    commit,
    rootGetters: { map, configuration },
    getters: { layerKeys, geometryLayerKeys, afterLoadFunction },
  }: PolarActionContext<GfiState, GfiGetters>,
  { coordinate, featureDisplayLayer }: DebouncedGfiRequestPayload
): Promise<void> {
  // fetch new feature information for all configured layers
  const promisedFeatures = layerKeys.map((key) => {
    const layer = map
      .getLayers()
      .getArray()
      .find((layer) => layer.getProperties().id === key)

    if (!(layer instanceof Layer)) {
      console.error(
        `No layer with id "${key}" found during run-time. GFI skipped.`
      )
      return [] as GeoJsonFeature[]
    }

    const layerConfiguration = configuration.gfi?.layers[key] || {}
    const layerSpecification = rawLayerList.getLayerWhere({ id: key })
    const mainLayerConfiguration = configuration.layers.find(
      (element) => element.id === key
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
  })

  const errorSymbol = (err: string) => Symbol(err)
  const features = (await Promise.allSettled(promisedFeatures)).map((result) =>
    result.status === 'fulfilled'
      ? result.value
      : errorSymbol(result.reason.message)
  )

  const generalMaxFeatures: number =
    configuration.gfi?.maxFeatures || Number.POSITIVE_INFINITY

  const srsName: string = map.getView().getProjection().getCode()
  // map features back to their layer keys
  let featuresByLayerId: GfiFeatureInformation = layerKeys.reduce(
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
