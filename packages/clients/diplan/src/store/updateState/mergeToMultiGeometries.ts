import { Feature, FeatureCollection, GeoJsonTypes } from 'geojson'
import { GeometryType } from '../../types'

const isMulti = (type: GeometryType['type']) => type.startsWith('Multi')
const multi = (type: GeometryType['type']) =>
  (isMulti(type) ? type : `Multi${type}`) as
    | 'MultiPoint'
    | 'MultiLineString'
    | 'MultiPolygon'

const mergeBin = (features: Feature<GeometryType>[]): Feature<GeometryType>[] =>
  !features.length
    ? []
    : [
        {
          ...features[0],
          geometry: {
            type: multi(features[0].geometry.type),
            coordinates: [
              ...features
                .map(({ geometry }) =>
                  isMulti(geometry.type)
                    ? geometry.coordinates
                    : [geometry.coordinates]
                )
                .flat(1),
            ],
          },
        } as Feature<GeometryType>,
      ]

const getGeometryBin = (type: GeoJsonTypes) =>
  type.endsWith('Point')
    ? 'points'
    : type.endsWith('LineString')
    ? 'lineStrings'
    : type.endsWith('Polygon')
    ? 'polygons'
    : ''

export const mergeToMultiGeometries = (
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
