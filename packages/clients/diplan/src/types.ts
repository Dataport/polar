import { FeatureCollection } from 'geojson'

export interface MetaService {
  id: string
  propertyNames?: string[]
  aggregationMode?: 'unequal' | 'all'
}

export interface DiplanConfiguration {
  mergeMultiGeometries?: boolean
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
