import { generateSimpleGetters } from '@repositoryname/vuex-generators'
import { GfiConfiguration, PolarGetterTree } from '@polar/lib-custom-types'
import noop from '@repositoryname/noop'
import { isVisible } from '@polar/lib-invisible-style'
import { Cluster as ClusterSource } from 'ol/source'
import { GeoJSON } from 'ol/format'
import { GfiGetters, GfiState } from '../types'
import { listableLayersFilter } from '../utils/listableLayersFilter'
import getInitialState from './getInitialState'

const getters: PolarGetterTree<GfiState, GfiGetters> = {
  ...generateSimpleGetters(getInitialState()),
  gfiConfiguration(_, __, ___, rootGetters) {
    return <GfiConfiguration>(rootGetters.configuration?.gfi || {
      afterLoadFunction: null,
      coordinateSources: [],
      layers: {},
    })
  },
  renderType(_, __, ___, rootGetters) {
    return rootGetters.configuration?.gfi?.renderType || 'independent'
  },
  renderMoveHandle(_, getters, __, rootGetters) {
    return (
      getters.renderType === 'independent' &&
      rootGetters.hasWindowSize &&
      rootGetters.hasSmallWidth
    )
  },
  gfiContentComponent(_, { gfiConfiguration }) {
    return gfiConfiguration.gfiContentComponent || null
  },
  afterLoadFunction(_, { gfiConfiguration }) {
    return typeof gfiConfiguration?.afterLoadFunction === 'function'
      ? gfiConfiguration.afterLoadFunction
      : null
  },
  currentProperties(
    _,
    { exportPropertyLayerKeys, visibleWindowFeatureIndex, windowFeatures }
  ) {
    const properties = {
      ...windowFeatures[visibleWindowFeatureIndex],
    }
    const exportProperty =
      exportPropertyLayerKeys[properties.polarInternalLayerKey]
    if (exportProperty?.length > 0) {
      delete properties[exportProperty]
    }
    return properties
  },
  layerKeys(_, { gfiConfiguration }) {
    return Object.keys(gfiConfiguration.layers)
  },
  exportProperty(
    _,
    {
      currentProperties,
      exportPropertyLayerKeys,
      visibleWindowFeatureIndex,
      windowFeatures,
    }
  ) {
    if (currentProperties) {
      const property =
        exportPropertyLayerKeys[currentProperties.polarInternalLayerKey]
      return property.length > 0
        ? (windowFeatures[visibleWindowFeatureIndex]?.[property] as string)
        : ''
    }
    return ''
  },
  exportPropertyLayerKeys(_, { gfiConfiguration }) {
    return Object.entries(gfiConfiguration.layers).reduce(
      (accumulator, [key, { exportProperty }]) => ({
        ...accumulator,
        [key]: typeof exportProperty === 'string' ? exportProperty : '',
      }),
      {} as Record<string, string>
    )
  },
  /** only show switch buttons if multiple property sets are available */
  showSwitchButtons(_, { windowFeatures }) {
    return windowFeatures.length > 1
  },
  windowLayerKeys(_, { gfiConfiguration }) {
    return Object.entries(gfiConfiguration.layers).reduce(
      (accumulator, [key, { window }]) => {
        if (window) {
          return [...accumulator, key]
        }
        return accumulator
      },
      [] as string[]
    )
  },
  windowLayerKeysActive(
    _,
    { windowLayerKeys, gfiConfiguration },
    __,
    rootGetters
  ) {
    const { activeLayerPath } = gfiConfiguration
    if (!activeLayerPath) {
      // if not configured, restriction does not apply
      return true
    }
    // update on change indicator
    noop(rootGetters[activeLayerPath])
    return Boolean(
      rootGetters.map
        .getLayers()
        .getArray()
        .filter(
          (layer) =>
            windowLayerKeys.includes(layer.get('id')) && layer.getVisible()
        ).length
    )
  },
  geometryLayerKeys(_, { gfiConfiguration }) {
    return Object.entries(gfiConfiguration.layers).reduce(
      (accumulator, [key, { geometry }]) => {
        if (geometry) {
          return [...accumulator, key]
        }
        return accumulator
      },
      [] as string[]
    )
  },
  windowFeatures(_, { featureInformation, windowLayerKeys, gfiConfiguration }) {
    return Object.entries(featureInformation)
      .map(([key, features]) =>
        /*
          NOTE: When displaying the features in the map, the first feature is rendered first
            thus lying under every other following feature. However, when using the gfi window,
            the first feature is initially displayed in the window.
            To have both in line, the feature displayed on top, the order of the features is reversed here for the window.
         */
        windowLayerKeys.includes(key) && Array.isArray(features)
          ? features.reverse().map(({ properties }) => {
              const baseProperties = { polarInternalLayerKey: key }
              const propertyReducer = gfiConfiguration.layers[key].properties

              // if it is an Array, just forward properties named in it
              if (Array.isArray(propertyReducer)) {
                return {
                  ...Object.fromEntries(
                    Object.entries(properties || {}).filter(([key]) =>
                      propertyReducer.includes(key)
                    )
                  ),
                  ...baseProperties,
                }
              }
              // if of type object, map keys, forward properties named in object keys
              if (typeof propertyReducer === 'object') {
                const relevantKeys = Object.keys(propertyReducer)
                return {
                  ...Object.fromEntries(
                    Object.entries(properties || {})
                      .filter(([key]) => relevantKeys.includes(key))
                      .map(([key, value]) => [propertyReducer[key], value])
                  ),
                  ...baseProperties,
                }
              }

              // if neither, just forward properties
              return { ...properties, ...baseProperties }
            })
          : []
      )
      .flat(1)
  },
  listMode(_, { gfiConfiguration }) {
    if (gfiConfiguration.featureList && !gfiConfiguration.featureList.mode) {
      console.error(
        '@polar/plugin-gfi: When using featureList a mode has to be chosen.'
      )
    }
    return gfiConfiguration.featureList?.mode
  },
  listText(_, { gfiConfiguration }) {
    return gfiConfiguration.featureList?.text || []
  },
  showList(_, { windowFeatures, gfiConfiguration }) {
    return Boolean(gfiConfiguration.featureList && !windowFeatures.length)
  },
  listableLayerSources(_, { layerKeys }, __, rootGetters) {
    return rootGetters.map
      .getLayers()
      .getArray()
      .filter((layer) => layerKeys.includes(layer.get('id')))
      .filter(listableLayersFilter)
      .map((layer) => {
        // @ts-expect-error | no sourceless layers in masterportalAPI generation
        let source = layer.getSource()
        while (source instanceof ClusterSource) {
          source = source.getSource()
        }
        source.set('_gfiLayerId', layer.get('id'), true)
        return source
      })
  },
  listFeatures(
    { visibilityChangeIndicator },
    { gfiConfiguration, listableLayerSources, listMode },
    __,
    rootGetters
  ) {
    const { map, clientHeight, clientWidth, center, zoomLevel } = rootGetters
    const writer = new GeoJSON()
    // trigger getter on those who indicate feature change possibility
    noop(clientHeight, clientWidth, center, zoomLevel)
    noop(visibilityChangeIndicator)
    return listableLayerSources
      .map((source) => {
        const layerId = source.get('_gfiLayerId')
        return (
          listMode === 'loaded'
            ? source.getFeatures()
            : source.getFeaturesInExtent(
                map.getView().calculateExtent(map.getSize()),
                map.getView().getProjection()
              )
        )
          .filter(isVisible)
          .filter((feature) => {
            const { isSelectable } = gfiConfiguration.layers[layerId]
            return typeof isSelectable === 'function'
              ? isSelectable(JSON.parse(writer.writeFeature(feature)))
              : true
          })
          .map((feature) => {
            // true = silent change (prevents cluster recomputation & rerender)
            feature.set('_gfiLayerId', layerId, true)
            return feature
          })
      })
      .flat(1)
  },
  isFeatureHovered: (_, __, ___, rootGetters) => (feature) => {
    const { hovered } = rootGetters
    return (
      hovered !== null &&
      (hovered === feature || hovered.get('features')
        ? hovered.get('features').includes(feature)
        : false)
    )
  },
}

export default getters
