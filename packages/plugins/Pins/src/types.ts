export interface PinsState {
  isActive: boolean
  transformedCoordinate: number[]
  latLon: number[]
  coordinatesAfterDrag: number[]
  getsDragged: boolean
}

export interface PinsGetters extends PinsState {
  toZoomLevel: number
  atZoomLevel: number
}
