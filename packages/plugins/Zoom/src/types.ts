import { ZoomIcons } from '@polar/lib-custom-types'

export interface ZoomState {
  zoomLevel: number
  maximumZoomLevel: number
  minimumZoomLevel: number
}

export interface ZoomGetters extends ZoomState {
  icons: ZoomIcons
  maximumZoomLevelActive: boolean
  minimumZoomLevelActive: boolean
  renderType: 'iconMenu' | 'independent'
  showMobile: boolean
}
