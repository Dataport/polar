import { Mode } from '@polar/plugin-draw'
import { FeatureCollection, Geometry, GeometryCollection } from 'geojson'

export interface MetaService {
  id: string
  propertyNames?: string[]
  aggregationMode?: 'unequal' | 'all'
}

export type DrawExtension = 'cut' | 'duplicate' | 'merge'
export type ExtendedDrawMode = Mode | DrawExtension

export interface DiplanConfiguration {
  mergeToMultiGeometries?: boolean
  validateGeoJson?: boolean
  metaServices?: MetaService[]
}

export interface DiplanState {
  drawMode: DrawExtension | null
  revisionInProgress: boolean
  simpleGeometryValidity: true
  revisedDrawExport: FeatureCollection
}

export interface DiplanGetters extends DiplanState {
  configuration: Required<DiplanConfiguration>
  activeDrawMode: ExtendedDrawMode
}

export type GeometryType = Exclude<Geometry, GeometryCollection>
