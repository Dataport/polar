import Geolocation from 'ol/Geolocation.js'
import { Vector as VectorSource } from 'ol/source'
import VectorLayer from 'ol/layer/Vector'
import Feature from 'ol/Feature'
export interface GeoLocationState {
  geolocation: Geolocation | null
  position: number[]
  tracking: boolean
  isGeolocationDenied: boolean
}

export interface GeoLocationGetters extends GeoLocationState {
  boundaryLayerId: string | undefined
  toastAction: string | undefined
  configuredEpsg: string
  checkLocationInitially: boolean
  geoLocationMarkerLayer: VectorLayer<VectorSource>
  keepCentered: boolean
  markerFeature: Feature
  zoomLevel: number
}
