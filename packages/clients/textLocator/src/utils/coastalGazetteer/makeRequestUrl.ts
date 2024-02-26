import { Geometry } from 'geojson'
import { GeoJSON, WKT } from 'ol/format'

const geoJson = new GeoJSON()
const wellKnownText = new WKT()

interface RequestPayload {
  keyword: string
  searchType: 'like' | 'exact' | 'id'
  lang: '-' | string
  sdate: string
  edate: string
  type: '-' | string
  page?: string // numerical
  geom?: string
}

const searchRequestDefaultPayload: Partial<RequestPayload> = {
  searchType: 'like',
  lang: '-',
  sdate: '0001-01-01',
  edate: new Date().toJSON().slice(0, 10),
  type: '-',
}

export const makeRequestUrl = (
  url: string,
  inputValue: string,
  page: string | undefined,
  geometry: Geometry | undefined,
  epsg: string
): string =>
  `${url}?${new URLSearchParams({
    ...searchRequestDefaultPayload,
    keyword: inputValue ? `*${inputValue}*` : '',
    ...(typeof page !== 'undefined' ? { page } : {}),
    ...(typeof geometry !== 'undefined'
      ? {
          geom: wellKnownText.writeGeometry(
            geoJson.readGeometry(geometry, {
              dataProjection: epsg,
              featureProjection: 'EPSG:4326',
            })
          ),
        }
      : {}),
  }).toString()}`
