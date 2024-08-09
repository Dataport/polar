import { PolarMapOptions } from '@polar/lib-custom-types'

export interface ScaleState {
  scaleValue: number
  scaleToOne: string
  scaleWithUnit: string
}

export interface ScaleGetters extends ScaleState {
  zoomOptions: PolarMapOptions[]
  showScaleSwitcher: boolean
}
