import { Feature } from 'ol'
import { LineString, Polygon } from 'ol/geom'
import { Color } from 'ol/color'
import { ColorLike } from 'ol/colorlike'

export type MeasureMode = 'distance' | 'area'

export type Mode = 'select' | 'draw' | 'edit' | 'delete'

export type Unit = 'm' | 'km'

export interface MeasureState {
  mode: Mode
  unit: Unit
  measureMode: MeasureMode
  selectedFeature: Feature | null
  geometry: LineString | Polygon | null
  measure: number | null
  selectedUnit: null | string
  active: boolean
}

export interface MeasureGetters extends MeasureState {
  color: Color | ColorLike
  textColor: Color | ColorLike
}

export interface StyleParameter {
  color: Color | ColorLike
  lineWidth: number
  opacity: number
  pointWidth: number
  textColor: Color | ColorLike
}
