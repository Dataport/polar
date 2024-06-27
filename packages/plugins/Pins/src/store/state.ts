import { PinsState } from '../types'

export const getInitialState = (): PinsState => ({
  transformedCoordinate: [],
  latLon: [],
  coordinatesAfterDrag: [],
  getsDragged: false,
})
