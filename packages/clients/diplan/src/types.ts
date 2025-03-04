import { FeatureCollection, Geometry, GeometryCollection } from 'geojson'

export interface MetaService {
  id: string
  propertyNames?: string[]
  aggregationMode?: 'unequal' | 'all'
}

export interface DiplanConfiguration {
  mergeToMultiGeometries?: boolean
  validateGeoJson?: boolean
  metaServices?: MetaService[]
}

export interface DiplanState {
  revisionInProgress: boolean
  simpleGeometryValidity: true
  revisedDrawExport: FeatureCollection
}

export interface DiplanGetters extends DiplanState {
  configuration: Required<DiplanConfiguration>
}

export type GeometryType = Exclude<Geometry, GeometryCollection>
