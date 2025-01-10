import debounce from 'lodash.debounce'
import { rawLayerList } from '@masterportal/masterportalapi'
import { Feature as GeoJsonFeature } from 'geojson'
import {
  GfiConfiguration,
  MapConfig,
  PolarActionContext,
} from '@polar/lib-custom-types'
import { Map, Feature } from 'ol'
import { Geometry } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import compare from 'just-compare'
import { filterFeatures } from '../../utils/filterFeatures'
import { requestGfi } from '../../utils/requestGfi'
import sortFeatures from '../../utils/sortFeatures'
import { FeaturesByLayerId, GfiGetters, GfiState } from '../../types'
import { renderFeatures } from '../../utils/renderFeatures'

interface GetFeatureInfoParameters {
  coordinateOrExtent: [number, number] | [number, number, number, number]
  modifierPressed?: boolean
}

const filterAndMapFeaturesToLayerIds = (
  layerKeys: string[],
  gfiConfiguration: GfiConfiguration,
  features: (symbol | GeoJsonFeature[])[],
  srsName: string
): FeaturesByLayerId => {
  const generalMaxFeatures =
    gfiConfiguration.maxFeatures || Number.POSITIVE_INFINITY
  const featuresByLayerId = layerKeys.reduce(
    (accumulator, key, index) => ({
      ...accumulator,
      [key]: Array.isArray(features[index])
        ? (features[index] as [])
            .filter(gfiConfiguration.layers[key].isSelectable || (() => true))
            .slice(
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
  coordinateOrExtent: [number, number] | [number, number, number, number]
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
      coordinateOrExtent,
      layerConfiguration,
      layerSpecification,
      mode: layerGfiMode,
    })
  })

const createSelectionDiff = (
  oldSelection: FeaturesByLayerId,
  newSelection: FeaturesByLayerId
): FeaturesByLayerId =>
  Object.entries(newSelection).reduce(
    (acc, [layerId, features]) => ({
      ...acc,
      [layerId]:
        Array.isArray(features) && Array.isArray(oldSelection[layerId])
          ? features.reduce((acc, newFeature) => {
              // If the feature is already in the old selection, remove it
              const oldFeatureIndex = acc.findIndex((oldFeature) =>
                compare(oldFeature.properties, newFeature.properties)
              )
              return oldFeatureIndex === -1
                ? [...acc, newFeature]
                : acc.filter((_, i) => i !== oldFeatureIndex)
            }, oldSelection[layerId] as GeoJsonFeature[])
          : features,
    }),
    {}
  )

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
      getters,
      rootGetters: { map, configuration },
    }: PolarActionContext<GfiState, GfiGetters>,
    { coordinateOrExtent, modifierPressed = false }: GetFeatureInfoParameters
  ): Promise<void> => {
    const { afterLoadFunction, layerKeys } = getters
    // fetch new feature information for all configured layers
    const features = (
      await Promise.allSettled(
        getPromisedFeatures(map, configuration, layerKeys, coordinateOrExtent)
      )
    ).map((result) =>
      result.status === 'fulfilled'
        ? result.value
        : errorSymbol(result.reason.message)
    )
    const srsName: string = map.getView().getProjection().getCode()
    let featuresByLayerId = filterAndMapFeaturesToLayerIds(
      layerKeys,
      getters.gfiConfiguration,
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
    if (modifierPressed) {
      featuresByLayerId = createSelectionDiff(
        getters.featureInformation,
        featuresByLayerId
      )
    }
    commit('setFeatureInformation', featuresByLayerId)
    renderFeatures(
      featureDisplayLayer,
      getters.geometryLayerKeys,
      featuresByLayerId
    )
  }

export const debouncedGfiRequest = (
  featureDisplayLayer: VectorLayer<Feature<Geometry>>
) => debounce(gfiRequest(featureDisplayLayer), 50)
