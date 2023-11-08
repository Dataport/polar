export interface ZoomState {
  zoomLevel: number
  maximumZoomLevel: number
  minimumZoomLevel: number
}

export interface ZoomGetters extends ZoomState {
  maximumZoomLevelActive: boolean
  minimumZoomLevelActive: boolean
  renderType: 'iconMenu' | 'independent'
  showMobile: boolean
}
