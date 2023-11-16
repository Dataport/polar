import Vue from 'vue'
import { generateSimpleGetters } from '@repositoryname/vuex-generators'
import { GeoJsonProperties } from 'geojson'
import { GfiConfiguration, PolarGetterTree } from '@polar/lib-custom-types'
import { GfiGetters, GfiState } from '../types'
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
}

export default getters
