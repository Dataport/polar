import { Feature, FeatureCollection, GeoJsonTypes, Position } from 'geojson'
import { GeometryType } from '../../types'

const isMulti = (type: GeometryType['type']) => type.startsWith('Multi')
const multi = (type: GeometryType['type']) =>
  (isMulti(type) ? type : `Multi${type}`) as
    | 'MultiPoint'
    | 'MultiLineString'
    | 'MultiPolygon'

const mergeBin = (
  features: Feature<GeometryType>[]
): Feature<GeometryType>[] => {
  if (!features.length) {
    return []
  }

  const result = [features[0]]

  result[0].geometry.type = multi(features[0].geometry.type)
  result[0].geometry.coordinates = [
    features.map(({ geometry }) => {
      if (isMulti(geometry.type)) {
        return geometry.coordinates[0]
      }
      return geometry.coordinates
    }) as Position, // actually also (... | Position[] | Position[][]), but can't | those types here for reasons unknown, albeit every single one works
  ]

  return result
}

const getGeometryBin = (type: GeoJsonTypes) =>
  type.endsWith('Point')
    ? 'points'
    : type.endsWith('LineString')
    ? 'lineStrings'
    : type.endsWith('Polygon')
    ? 'polygons'
    : ''

export const mergeMultiGeometries = (
  featureCollection: FeatureCollection<GeometryType>
): FeatureCollection<GeometryType> => {
  const bins = featureCollection.features.reduce(
    (accumulator, current) => {
      const bin = getGeometryBin(current.geometry.type)
      if (bin) {
        accumulator[bin].push(current)
      } else {
        console.warn(
          `@polar/client-diplan: Unsupported geometry input "${current.geometry.type}" in multi geometry merge skipped.`
        )
      }
      return accumulator
    },
    {
      points: [],
      lineStrings: [],
      polygons: [],
    } as Record<'points' | 'lineStrings' | 'polygons', Feature<GeometryType>[]>
  )

  return {
    ...featureCollection,
    features: [
      ...mergeBin(bins.points),
      ...mergeBin(bins.lineStrings),
      ...mergeBin(bins.polygons),
    ],
  }
}
