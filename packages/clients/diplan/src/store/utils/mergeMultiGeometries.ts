import { Feature, FeatureCollection, GeoJsonTypes } from 'geojson'

type GeometryType = Exclude<
  GeoJsonTypes,
  'Feature' | 'FeatureCollection' | 'GeometryCollection'
>

const isMulti = (type: string) => type.startsWith('Multi')
const multi = (type: string): string => (isMulti(type) ? type : `Multi${type}`)

const mergeBin = (features: Feature[]): [Feature] | [] =>
  features.length === 0
    ? []
    : [
        {
          ...features[0],
          geometry: {
            type: multi(features[0].geometry.type) as GeometryType,
            coordinates: [
              ...features.map(({ geometry }) =>
                isMulti(geometry.type)
                  ? // @ts-expect-error | We know it's no GeometryCollection
                    geometry.coordinates[0]
                  : // @ts-expect-error | We know it's no GeometryCollection
                    geometry.coordinates
              ),
            ],
          },
        },
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
