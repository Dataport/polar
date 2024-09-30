import { union } from '@turf/union'
import { flatten } from '@turf/flatten'
import { Feature, Geometry, Polygon } from 'geojson'
import { wgs84ProjectionCode } from '../common'
import { geoJson, wellKnownText } from './common'
import { MakeRequestBodyParameters, RequestPayload } from './types'

const searchRequestDefaultPayload: RequestPayload = {
  searchType: 'like',
  lang: '-',
  sdate: '0001-01-01',
  edate: new Date().toJSON().slice(0, 10),
  type: '-',
}

/**
 * Reduces overlapping MultiPolygon to MultiPolygon without overlapping
 * geometries. This is required for the following step, where the MultiPolygon
 * is converted to WKT. WKT forbids overlapping geometries in a MultiPolygon.
 */
const unify = (geometry: Geometry): Geometry => {
  if (geometry.type === 'MultiPolygon') {
    // NOTE: never null, input from flatten merges as expected
    return (union(flatten(geometry)) as Feature<Polygon>).geometry
  }
  console.warn(
    `@polar/client-text-locator: Unexpected geometry in request body creation.`
  )
  return geometry
}

export const makeRequestBody = (
  { keyword, page, geometry, ...rest }: Partial<MakeRequestBodyParameters>,
  epsg: `EPSG:${string}`
): string =>
  Object.entries({
    ...searchRequestDefaultPayload,
    keyword: keyword ? `*${keyword}*` : '',
    ...(typeof page !== 'undefined' ? { page } : {}),
    ...(typeof geometry !== 'undefined'
      ? {
          geom: wellKnownText.writeGeometry(
            geoJson.readGeometry(unify(geometry), {
              dataProjection: epsg,
              featureProjection: wgs84ProjectionCode,
            })
          ),
        }
      : {}),
    ...rest,
  })
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
