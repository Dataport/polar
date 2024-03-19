import { PinsState } from '../types'

export const getInitialState = (): PinsState => ({
  isActive: false,
  transformedCoordinate: [],
  latLon: [],
  coordinatesAfterDrag: [],
  getsDragged: false,
})
