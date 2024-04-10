import { Feature } from 'ol'
import LineString from 'ol/geom/LineString'

export type Color = {
    r: number,
    g: number,
    b: number
}

export type Mode = 'select' | 'draw' | 'edit' | 'delete'

export type Unit = 'm' | 'km'

export interface FeatureDistanceState {
    mode: Mode,
    unit: Unit,
    lineFeature: Feature | null,
    line: LineString | null,
    length: Number | null
    color: Color,
    textColor: Color,
    active: boolean
}


export interface FeatureDistanceGetters extends FeatureDistanceState {
    getRoundedLength: Function,
    selectableModes: Mode[],
    selectableUnits: Unit[]
}




  