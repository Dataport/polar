import {
  PointerPositionConfiguration,
  PointerPositionProjection,
} from '@polar/lib-custom-types'

export interface PointerPositionState {
  selectedProjection: number
  pointerPosition: number[]
}

export interface PointerPositionGetters extends PointerPositionState {
  configuration: PointerPositionConfiguration
  projections: Required<PointerPositionProjection>[]
  coordinateString: string
}
