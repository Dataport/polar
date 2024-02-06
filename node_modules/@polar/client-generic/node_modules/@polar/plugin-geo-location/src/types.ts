import Geolocation from 'ol/Geolocation.js'
import { Vector as VectorSource } from 'ol/source'
import VectorLayer from 'ol/layer/Vector'
import Feature from 'ol/Feature'
import { GeoLocationConfiguration } from '@polar/lib-custom-types'
export interface GeoLocationState {
  geolocation: Geolocation | null
  position: number[]
  tracking: boolean
  isGeolocationDenied: boolean
}

export interface GeoLocationGetters extends GeoLocationState {
  boundaryLayerId: GeoLocationConfiguration['boundaryLayerId']
  boundaryOnError: GeoLocationConfiguration['boundaryOnError']
  toastAction: string | undefined
  configuredEpsg: string
  checkLocationInitially: boolean
  geoLocationMarkerLayer: VectorLayer<VectorSource>
  keepCentered: boolean
  markerFeature: Feature
  renderType: string
  showTooltip: boolean
  zoomLevel: number
}
