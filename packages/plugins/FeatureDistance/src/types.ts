import { Feature } from 'ol'
import { Polygon } from 'ol/geom'
import LineString from 'ol/geom/LineString'

export type Color = {
    r: number,
    g: number,
    b: number
}

export type Mode = 'select' | 'draw' | 'edit' | 'delete'

export type Unit = 'm' | 'km' 

export type MeasureMode = 'distance' | 'area'

export interface FeatureDistanceState {
    mode: Mode,
    unit: Unit,
    measureMode: MeasureMode,
    selectedFeature: Feature | null,
    geometry: LineString | Polygon | null,
    measure: number | null,
    selectedUnit: null | string,
    color: Color,
    textColor: Color,
    active: boolean
}


export interface FeatureDistanceGetters extends FeatureDistanceState {
    getRoundedMeasure: Function,
    selectableModes: Mode[],
    selectableUnits: Unit[]
}

export interface StyleParameter {
    color: Color,
    text: Color,
    opacity: number,
    lineWidth: number,
    pointWidth: number
}



  