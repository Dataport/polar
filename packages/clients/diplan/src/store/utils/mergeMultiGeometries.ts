import {
  Feature,
  FeatureCollection,
  GeoJsonTypes,
  Geometry,
  GeometryCollection,
} from 'geojson'

type Type = Exclude<Geometry, GeometryCollection>

const isMulti = (type: string) => type.startsWith('Multi')
const multi = (type: string): string => (isMulti(type) ? type : `Multi${type}`)

const mergeBin = (features: Feature<Type>[]): [Feature<Type>] | [] =>
  features.length === 0
    ? []
    : [
        {
          ...features[0],
          geometry: {
            type: multi(features[0].geometry.type),
            coordinates: [
              ...features.map(({ geometry }) =>
                isMulti(geometry.type)
                  ? geometry.coordinates[0]
                  : geometry.coordinates
              ),
            ],
          },
        } as Feature<Type>,
      ]

const getGeometryBin = (type: GeoJsonTypes): string =>
  type.endsWith('Point')
    ? 'points'
    : type.endsWith('LineString')
    ? 'lineStrings'
    : type.endsWith('Polygon')
    ? 'polygons'
    : ''

export const mergeMultiGeometries = (
  featureCollection: FeatureCollection
): FeatureCollection => {
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
    }
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
