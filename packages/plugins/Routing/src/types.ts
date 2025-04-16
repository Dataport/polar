import VectorSource from 'ol/source/Vector'
import { StyleLike } from 'ol/style/Style'
import { RoutingConfiguration } from '@polar/lib-custom-types' // Wird erst nach mergen des Pull Requests upgedated
import { Coordinate } from 'ol/coordinate'

// The options that can be given to an ol/VectorLayer. Somehow the direct import from ol doesn't work.
// This is a copy with the things that we currently use
export interface PolarVectorOptions {
  source?: VectorSource
  style?: StyleLike
}

export interface SearchResponseDataInterface {
  hausnummer: string
  hausnummerZusatz: string
  geographicIdentifier: string
  position: number[]
  boundingPolygon: number[]
}

export interface FeatureInterface {
  strassenname: string
  ortsteilname: string
  position: number[] | null
  boundingPolygon: number[] | null
  hausnummern: (string | null)[]
}

export interface RoutingState {
  start: Coordinate
  startAddress: string
  end: Coordinate
  endAddress: string
  selectedTravelMode: string
  selectableTravelModes: Array<{ key: string; localKey: string }>
  displayPreferences: boolean
  selectedPreference: string
  selectablePreferences: Array<{ key: string; localKey: string }>
  displayRouteTypesToAvoid: boolean
  selectedRouteTypesToAvoid: string[]
  selectableRouteTypesToAvoid: Array<{ key: string; localKey: string }>
  serviceID: string
  queryParameters: object
  searchInput: string
  addressSearchUrl: string
  minLength: number
  waitMs: number
  searchResponseData: SearchResponseDataInterface
  searchResults: Array<object>
  mousePosition: Coordinate
}

export interface RoutingGetters extends RoutingState {
  start: Coordinate
  startAddress: string
  end: Coordinate
  endAddress: string
  selectedTravelMode: string
  selectableTravelModes: Array<{ key: string; localKey: string }>
  displayPreferences: boolean
  selectedPreference: string
  selectablePreferences: Array<{ key: string; localKey: string }>
  displayRouteTypesToAvoid: boolean
  selectedRouteTypesToAvoid: string[]
  selectableRouteTypesToAvoid: Array<{ key: string; localKey: string }>
  serviceID: string
  queryParameters: object
  searchInput: string
  addressSearchUrl: string
  minLength: number
  waitMs: number
  searchResponseData: SearchResponseDataInterface
  searchResults: Array<object>
  mousePosition: Coordinate
  routingConfiguration: RoutingConfiguration
}
