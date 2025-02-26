import isEqual from 'lodash.isequal'
import { FeatureCollection, Feature as GeoJsonFeature } from 'geojson'
import { Feature, Map } from 'ol'
import { GeoJSON } from 'ol/format'
import {
  getVectorFeaturesByFeatureRequest,
  parseWfsResponse,
} from '@polar/lib-get-features'
import { rawLayerList } from '@masterportal/masterportalapi'
import { booleanIntersects } from '@turf/boolean-intersects'
import { MetaService } from '../../types'

const reader = new GeoJSON()

type Aggregator = (
  propertiesArray: Exclude<GeoJsonFeature['properties'], null>[]
) => GeoJsonFeature['properties'][] | GeoJsonFeature['properties']

const aggregators: Record<
  Exclude<MetaService['aggregationMode'], undefined>,
  Aggregator
> = {
  all: (x) => x,
  unequal: (propertiesArray) =>
    propertiesArray.reduce((accumulator, current) => {
      if (accumulator.every((entry) => !isEqual(entry, current))) {
        accumulator.push(current)
      }
      return accumulator
    }, []),
}

const filterProperties = (
  properties: GeoJsonFeature['properties'],
  propertyNames?: string[]
) =>
  typeof properties === 'object' &&
  properties !== null &&
  propertyNames &&
  propertyNames.length
    ? Object.fromEntries(
        Object.entries(properties).filter(([key]) =>
          propertyNames.includes(key)
        )
      )
    : properties

const aggregateProperties = (
  propertiesArray: GeoJsonFeature['properties'][],
  propertyNames?: string[],
  mode: MetaService['aggregationMode'] = 'unequal'
) =>
  aggregators[mode](
    propertiesArray
      .map((properties) => filterProperties(properties, propertyNames))
      .filter((properties) => properties !== null)
  )

/** @throws */
export const enrichWithMetaServices = (
  featureCollection: FeatureCollection,
  map: Map,
  metaServices: MetaService[]
) =>
  Promise.all(
    featureCollection.features.map((feature) =>
      Promise.all(
        metaServices.map(({ id, propertyNames, aggregationMode }) =>
          getVectorFeaturesByFeatureRequest({
            feature: reader.readFeature(JSON.stringify(feature)) as Feature,
            fetchLayerId: id,
            projectionCode: map.getView().getProjection().getCode(),
          })
            .then((resolution) =>
              rawLayerList.getLayerWhere({ id }).typ === 'WFS'
                ? parseWfsResponse(resolution, undefined, false)
                : (resolution.json() as Promise<FeatureCollection>)
            )
            .then(
              (featuresFromBbox) =>
                (feature.properties = {
                  ...feature.properties,
                  metaProperties: {
                    ...(feature.properties?.metaProperties || {}),
                    [id]: aggregateProperties(
                      featuresFromBbox.features
                        .filter((featureFromBbox) =>
                          booleanIntersects(featureFromBbox, feature)
                        )
                        .map(({ properties }) => properties),
                      propertyNames,
                      aggregationMode
                    ),
                  },
                })
            )
        )
      )
    )
  )
