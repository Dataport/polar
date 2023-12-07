import Vue from 'vue'
import { generateSimpleGetters } from '@repositoryname/vuex-generators'
import { GeoJsonProperties } from 'geojson'
import {
  FeatureList,
  GfiConfiguration,
  PolarGetterTree,
} from '@polar/lib-custom-types'
import noop from '@repositoryname/noop'
import { isVisible } from '@polar/lib-invisible-style'
import { Feature } from 'ol'
import { Cluster as ClusterSource } from 'ol/source'
import { GfiGetters, GfiState } from '../types'
import { listableLayersFilter } from '../utils/listableLayersFilter'
import getInitialState from './getInitialState'

const getters: PolarGetterTree<GfiState, GfiGetters> = {
  ...generateSimpleGetters(getInitialState()),
  gfiConfiguration(_, __, ___, rootGetters): GfiConfiguration {
    return <GfiConfiguration>(rootGetters.configuration?.gfi || {
      afterLoadFunction: null,
      coordinateSources: [],
      layers: {},
    })
  },
  gfiContentComponent(_, { gfiConfiguration }): Vue | null {
    return gfiConfiguration.gfiContentComponent || null
  },
  afterLoadFunction(_, { gfiConfiguration }) {
    return typeof gfiConfiguration?.afterLoadFunction === 'function'
      ? gfiConfiguration.afterLoadFunction
      : null
  },
  layerKeys(_, { gfiConfiguration }) {
    return Object.keys(gfiConfiguration?.layers || {})
  },
  exportPropertyLayerKeys(_, { gfiConfiguration }) {
    return Object.entries(gfiConfiguration?.layers || {}).reduce(
      (accumulator, [key, { exportProperty }]) => ({
        ...accumulator,
        [key]: typeof exportProperty === 'string' ? exportProperty : '',
      }),
      {} as Record<string, string>
    )
  },
  windowLayerKeys(_, { gfiConfiguration }): string[] {
    return Object.entries(gfiConfiguration?.layers || {}).reduce(
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
  ): boolean {
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
  geometryLayerKeys(_, { gfiConfiguration }): string[] {
    return Object.entries(gfiConfiguration?.layers || {}).reduce(
      (accumulator, [key, { geometry }]) => {
        if (geometry) {
          return [...accumulator, key]
        }
        return accumulator
      },
      [] as string[]
    )
  },
  windowFeatures(
    _,
    { featureInformation, windowLayerKeys, gfiConfiguration }
  ): GeoJsonProperties[] {
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
  listMode(_, { gfiConfiguration }): FeatureList['mode'] | undefined {
    if (gfiConfiguration.featureList && !gfiConfiguration.featureList.mode) {
      console.error(
        'POLAR: When using featureList in GFI plugin, a mode must be chosen.'
      )
    }
    return gfiConfiguration.featureList?.mode
  },
  listText(_, { gfiConfiguration }): FeatureList['text'] {
    return gfiConfiguration.featureList?.text || []
  },
  showList(_, { windowFeatures, gfiConfiguration }): boolean {
    return Boolean(gfiConfiguration.featureList && !windowFeatures.length)
  },
  listFeatures(
    { visibilityChangeIndicator },
    { listMode, layerKeys },
    __,
    rootGetters
  ): Feature[] {
    const { map, clientHeight, clientWidth, center, zoomLevel } = rootGetters
    // trigger getter on those who indicate feature change possibility
    noop(clientHeight, clientWidth, center, zoomLevel)
    noop(visibilityChangeIndicator)
    return map
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
        return (
          listMode === 'loaded'
            ? source.getFeatures()
            : source.getFeaturesInExtent(
                map.getView().calculateExtent(map.getSize()),
                map.getView().getProjection()
              )
        )
          .filter(isVisible)
          .map((feature) => {
            feature.set('_gfiLayerId', layer.get('id'), true)
            return feature
          })
      })
      .flat(1)
  },
}

export default getters
