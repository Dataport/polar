import debounce from 'lodash.debounce'
import { rawLayerList } from '@masterportal/masterportalapi'
import {
  Feature as GeoJsonFeature,
  GeoJsonProperties,
  Geometry as GeoJsonGeometry,
} from 'geojson'
import { PolarActionContext } from '@polar/lib-custom-types'
import { Feature } from 'ol'
import { Geometry } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import { addFeature } from '../../utils/displayFeatureLayer'
import { requestGfi } from '../../utils/requestGfi'
import sortFeatures from '../../utils/sortFeatures'
import { GfiGetters, GfiState } from '../../types'

const mapFeaturesToLayerIds = (
  {
    getters: { layerKeys },
    rootGetters: { configuration },
  }: PolarActionContext<GfiState, GfiGetters>,
  features: (symbol | GeoJsonFeature<GeoJsonGeometry, GeoJsonProperties>[])[],
  srsName: string
) => {
  const generalMaxFeatures: number =
    configuration.gfi?.maxFeatures || Number.POSITIVE_INFINITY
  const featuresByLayerId = layerKeys.reduce(
    (accumulator, key, index) => ({
      ...accumulator,
      [key]: Array.isArray(features[index])
        ? (features[index] as []).slice(
            0,
            configuration.gfi?.layers[key].maxFeatures || generalMaxFeatures
          )
        : features[index],
    }),
    {}
  )
  return Object.entries(featuresByLayerId).reduce(
    (accumulator, [layerKey, layerValues]) => ({
      ...accumulator,
      [layerKey]:
        Array.isArray(layerValues) && layerValues.length >= 2
          ? layerValues.sort((a, b) => sortFeatures(a, b, srsName))
          : layerValues,
    }),
    {}
  )
}

const getPromisedFeatures = (
  {
    rootGetters: { map, configuration },
    getters: { layerKeys },
  }: PolarActionContext<GfiState, GfiGetters>,
  coordinate: [number, number]
) =>
  layerKeys.map((key) => {
    const layer = map
      .getLayers()
      .getArray()
      .find((layer) => layer.getProperties().id === key)

    if (!layer) {
      console.error(
        `@polar/plugin-gfi: No layer with id "${key}" found during run-time. GFI skipped.`
      )
      return [] as GeoJsonFeature[]
    }

    const layerConfiguration = configuration.gfi?.layers[key] || {}
    const layerSpecification = rawLayerList.getLayerWhere({ id: key })
    const mainLayerConfiguration = configuration.layers.find(
      (element) => element.id === key
    )
    const layerGfiMode =
      mainLayerConfiguration?.gfiMode || configuration?.gfi?.mode || 'bboxDot'

    return requestGfi({
      map,
      layer,
      coordinate,
      layerConfiguration,
      layerSpecification,
      mode: layerGfiMode,
    })
  })

const filterFeatures = (
  featuresByLayerId: Record<
    string,
    symbol | GeoJsonFeature<GeoJsonGeometry, GeoJsonProperties>[]
  >
): Record<string, GeoJsonFeature<GeoJsonGeometry, GeoJsonProperties>[]> => {
  const entries = Object.entries(featuresByLayerId)
  const filtered = entries.filter((keyValue) => Array.isArray(keyValue[1])) as [
    string,
    GeoJsonFeature<GeoJsonGeometry, GeoJsonProperties>[]
  ][]
  return Object.fromEntries(filtered)
}

/**
 * Code from `getFeatureInfo`, pulled to avoid overly requesting feature
 * information. Since sources in Pins plugin update right after each other
 * (and such effects are to be expected across the system), we're debouncing
 * this *after* resetting the module state, as something is bound to happen.
 */
// eslint-disable-next-line max-lines-per-function
const gfiRequest =
  (featureDisplayLayer: VectorLayer<Feature<Geometry>>) =>
  async (
    actionContext: PolarActionContext<GfiState, GfiGetters>,
    coordinate: [number, number]
  ): Promise<void> => {
    const {
      commit,
      rootGetters: { map },
      getters: { geometryLayerKeys, afterLoadFunction },
    } = actionContext
    // fetch new feature information for all configured layers
    const promisedFeatures = getPromisedFeatures(actionContext, coordinate)

    const errorSymbol = (err) => Symbol(err)
    const features = (await Promise.allSettled(promisedFeatures)).map(
      (result) =>
        result.status === 'fulfilled'
          ? result.value
          : errorSymbol(result.reason.message)
    )

    const srsName: string = map.getView().getProjection().getCode()
    let featuresByLayerId: Record<string, GeoJsonFeature[] | symbol> =
      mapFeaturesToLayerIds(actionContext, features, srsName)

    // store features in state, if configured via client after specific function
    if (typeof afterLoadFunction === 'function') {
      featuresByLayerId = await afterLoadFunction(
        filterFeatures(featuresByLayerId),
        srsName
      )
    }
    commit('setFeatureInformation', featuresByLayerId)

    // render feature geometries to help layer
    geometryLayerKeys
      .filter((key) => Array.isArray(featuresByLayerId[key]))
      .forEach((key) =>
        // @ts-expect-error | Might be fixed through having all the types in the action. Otherwise: It works properly, as all the symbols are filtered before calling forEach
        featuresByLayerId[key].forEach((feature) =>
          addFeature(feature, featureDisplayLayer)
        )
      )
  }

// TODO: Types are not properly displayed here as it is wrapped through debounce
export const debouncedGfiRequest = (
  featureDisplayLayer: VectorLayer<Feature<Geometry>>
) => debounce(gfiRequest(featureDisplayLayer), 50)
