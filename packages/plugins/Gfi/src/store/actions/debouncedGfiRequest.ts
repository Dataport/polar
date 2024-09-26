import debounce from 'lodash.debounce'
import { rawLayerList } from '@masterportal/masterportalapi'
import {
  Feature as GeoJsonFeature,
  GeoJsonProperties,
  Geometry as GeoJsonGeometry,
} from 'geojson'
import {
  GfiConfiguration,
  MapConfig,
  PolarActionContext,
} from '@polar/lib-custom-types'
import { Map, Feature } from 'ol'
import { Geometry } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import { addFeature } from '../../utils/displayFeatureLayer'
import { requestGfi } from '../../utils/requestGfi'
import sortFeatures from '../../utils/sortFeatures'
import { GfiGetters, GfiState } from '../../types'

const mapFeaturesToLayerIds = (
  layerKeys: string[],
  gfiConfiguration: GfiConfiguration,
  features: (symbol | GeoJsonFeature<GeoJsonGeometry, GeoJsonProperties>[])[],
  srsName: string
): Record<string, GeoJsonFeature[] | symbol> => {
  const generalMaxFeatures: number =
    gfiConfiguration.maxFeatures || Number.POSITIVE_INFINITY
  const featuresByLayerId = layerKeys.reduce(
    (accumulator, key, index) => ({
      ...accumulator,
      [key]: Array.isArray(features[index])
        ? (features[index] as []).slice(
            0,
            gfiConfiguration.layers[key].maxFeatures || generalMaxFeatures
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
  map: Map,
  configuration: MapConfig,
  layerKeys: string[],
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

const errorSymbol = (err) => Symbol(err)

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
    {
      commit,
      getters: { layerKeys },
      rootGetters: { map, configuration },
      getters: { geometryLayerKeys, afterLoadFunction },
    }: PolarActionContext<GfiState, GfiGetters>,
    coordinate: [number, number]
  ): Promise<void> => {
    // fetch new feature information for all configured layers
    const promisedFeatures = getPromisedFeatures(
      map,
      configuration,
      layerKeys,
      coordinate
    )
    const features = (await Promise.allSettled(promisedFeatures)).map(
      (result) =>
        result.status === 'fulfilled'
          ? result.value
          : errorSymbol(result.reason.message)
    )
    const srsName: string = map.getView().getProjection().getCode()
    let featuresByLayerId = mapFeaturesToLayerIds(
      layerKeys,
      // NOTE if there was no configuration, we would not be here
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      configuration.gfi!,
      features,
      srsName
    )
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
        filterFeatures(featuresByLayerId)[key].forEach((feature) =>
          addFeature(feature, featureDisplayLayer)
        )
      )
  }

export const debouncedGfiRequest = (
  featureDisplayLayer: VectorLayer<Feature<Geometry>>
) => debounce(gfiRequest(featureDisplayLayer), 50)
