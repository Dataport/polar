import { cleanCoords } from '@turf/clean-coords'
import { unkinkPolygon } from '@turf/unkink-polygon'
import {
  Feature as GeoJsonFeature,
  FeatureCollection,
  MultiPolygon,
  Polygon,
} from 'geojson'
import { GeometryType } from '../../types'

export const autofixFeatureCollection = (
  revisedFeatureCollection: FeatureCollection<GeometryType>
) => ({
  ...revisedFeatureCollection,
  features: revisedFeatureCollection.features.reduce((accumulator, feature) => {
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
  }, [] as GeoJsonFeature<GeometryType>[]),
})
