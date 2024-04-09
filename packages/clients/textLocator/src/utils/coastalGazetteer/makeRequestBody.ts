import { wgs84ProjectionCode } from '../common'
import { geoJson, wellKnownText } from './common'
import { MakeRequestBodyParameters, RequestPayload } from './types'

const searchRequestDefaultPayload: Partial<RequestPayload> = {
  searchType: 'like',
  lang: '-',
  sdate: '0001-01-01',
  edate: new Date().toJSON().slice(0, 10),
  type: '-',
}

export const makeRequestBody = (
  { keyword, page, geometry, ...rest }: Partial<MakeRequestBodyParameters>,
  epsg: string
): string =>
  Object.entries({
    ...searchRequestDefaultPayload,
    keyword: keyword ? `*${keyword}*` : '',
    ...(typeof page !== 'undefined' ? { page } : {}),
    ...(typeof geometry !== 'undefined'
      ? {
          geom: wellKnownText.writeGeometry(
            geoJson.readGeometry(geometry, {
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
