import { ZoomConfiguration, ZoomIcons } from '@polar/lib-custom-types'
import { VueConstructor } from 'vue'

export interface ZoomState {
  zoomLevel: number
  maximumZoomLevel: number
  minimumZoomLevel: number
}

export interface ZoomGetters extends ZoomState {
  configuration: ZoomConfiguration
  component: VueConstructor | null
  icons: ZoomIcons
  maximumZoomLevelActive: boolean
  minimumZoomLevelActive: boolean
  renderType: 'iconMenu' | 'independent'
  showMobile: boolean
  showZoomSlider: boolean
}
