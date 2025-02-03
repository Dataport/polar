import { GeoLocationConfiguration } from '@polar/lib-custom-types'
import Feature from 'ol/Feature'
import Geolocation from 'ol/Geolocation'
import VectorLayer from 'ol/layer/Vector'

export interface GeoLocationState {
  geolocation: Geolocation | null
  position: number[]
  tracking: boolean
  isGeolocationDenied: boolean
  boundaryCheck: boolean | symbol | null
}

export interface GeoLocationGetters extends GeoLocationState {
  boundaryLayerId: GeoLocationConfiguration['boundaryLayerId']
  boundaryOnError: GeoLocationConfiguration['boundaryOnError']
  toastAction: string | undefined
  configuredEpsg: string
  checkLocationInitially: boolean
  geoLocationMarkerLayer: VectorLayer
  keepCentered: boolean
  markerFeature: Feature
  renderType: string
  showTooltip: boolean
  zoomLevel: number
}
