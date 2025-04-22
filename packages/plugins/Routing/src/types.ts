import { type RoutingConfiguration } from '@polar/lib-custom-types'
import type VectorSource from 'ol/source/Vector'
import { type StyleLike } from 'ol/style/Style'
import { type Coordinate } from 'ol/coordinate'

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

interface Selectable {
  key: string
  localKey: string
}

export interface RoutingState {
  start: Coordinate
  startAddress: string
  end: Coordinate
  endAddress: string
  selectedTravelMode: string
  selectableTravelModes: Selectable[]
  displayPreferences: boolean
  selectedPreference: string
  selectablePreferences: Selectable[]
  displayRouteTypesToAvoid: boolean
  selectedRouteTypesToAvoid: string[]
  selectableRouteTypesToAvoid: Selectable[]
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
  routingConfiguration: RoutingConfiguration
}
