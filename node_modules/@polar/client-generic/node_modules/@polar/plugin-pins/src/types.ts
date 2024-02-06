export interface PinsState {
  isActive: boolean
  transformedCoordinate: number[]
  latLon: number[]
  coordinatesAfterDrag: number[]
  getsDragged: boolean
  toZoomLevel: number
  atZoomLevel: number
}
