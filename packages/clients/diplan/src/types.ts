import { Mode } from '@polar/plugin-draw'
import { FeatureCollection, Geometry, GeometryCollection } from 'geojson'

export interface MetaService {
  id: string
  propertyNames?: string[]
  aggregationMode?: 'unequal' | 'all'
}

export type DrawExtension = 'cut' | 'duplicate' | 'merge'
export type ExtendedDrawMode = Mode | DrawExtension

export type GeoEditingMode =
  | 'drawPolygon'
  | 'drawCircle'
  | 'merge'
  | 'cut'
  | 'duplicate'
  | 'lasso'
  | 'edit'
  | 'translate'
  | 'delete'

interface LinkConfig {
  href: string
  icon: string
  label: string
}

export interface DiplanConfiguration {
  link: LinkConfig
  mergeToMultiGeometries?: boolean
  validateGeoJson?: boolean
  renderType?: 'iconMenu' | 'independent'
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
