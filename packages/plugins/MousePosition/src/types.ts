import { MousePositionConfiguration } from '@polar/lib-custom-types'

export interface MousePositionState {
  selectedProjection: number
  mousePosition: number[]
}

export interface MousePositionGetters extends MousePositionState {
  configuration: Required<MousePositionConfiguration>
  projections: Required<MousePositionConfiguration>['projections']
}
