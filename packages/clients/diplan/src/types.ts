import type { Mode } from '@polar/plugin-draw'
import type { FeatureCollection } from 'geojson'

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
  renderType?: 'iconMenu' | 'independent'
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
