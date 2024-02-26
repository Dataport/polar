// such names exist on the service
/* eslint-disable @typescript-eslint/naming-convention */
import { Geometry } from 'geojson'

// // // REQUEST // // //

export interface RequestPayload {
  keyword: string
  searchType: 'like' | 'exact' | 'id'
  lang: '-' | string
  sdate: string
  edate: string
  type: '-' | string
  page?: string // numerical
  geom?: string
}

export interface MakeRequestUrlParameters extends RequestPayload {
  geometry?: Geometry
}

// // // RESPONSE // // //

export interface ResponseName {
  Start: string // YYYY-MM-DD
  Ende: string // YYYY-MM-DD
  GeomID: string
  ObjectID: string
  Name: string
  Quellen: object[] // not used
  Rezent: boolean
  Sprache: string
  Typ: string
}

export interface ResponseGeom {
  Start: string // YYYY-MM-DD
  Ende: string // YYYY-MM-DD
  GeomID: string
  ObjectID: string
  Quellen: object[] // not used
  Typ: string
  'Typ Beschreibung': string
  WKT: string // WKT geometry
}

export interface ResponseResult {
  id: string
  names: ResponseName[]
  geoms: ResponseGeom[]
}

export interface ResponsePayload {
  count: string // numerical
  currentpage: string // numerical
  pages: string // numerical
  keyword: string
  querystring: string
  results: ResponseResult[]
  time: number
}
