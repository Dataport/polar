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
  page?: `${number}`
  geom?: string
}

export interface MakeRequestBodyParameters extends RequestPayload {
  geometry?: Geometry
}

// // // RESPONSE // // //

export interface ResponseName {
  Start: `${number}-${number}-${number}` // YYYY-MM-DD
  Ende: `${number}-${number}-${number}` // YYYY-MM-DD
  GeomID: string
  ObjectID: string
  Name: string
  Quellen: object[] // not used
  Rezent: boolean
  Sprache: string
  Typ: string
}

export interface ResponseGeom {
  Start: `${number}-${number}-${number}` // YYYY-MM-DD
  Ende: `${number}-${number}-${number}` // YYYY-MM-DD
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
  count: `${number}`
  currentpage: `${number}`
  pages: `${number}`
  keyword: string
  querystring: string
  results: ResponseResult[]
  time: number
}
