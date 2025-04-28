import {
  type RoutingConfiguration,
  RoutingSearchConfiguration,
} from '@polar/lib-custom-types'
import { type Coordinate } from 'ol/coordinate'
import type VectorSource from 'ol/source/Vector'
import { type StyleLike } from 'ol/style/Style'

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
  locale: string
}

export interface RoutingState {
  currentlyFocusedInput: number
  route: Coordinate[]
  routeAsWGS84: Coordinate[]
  selectedTravelMode: string
  displayPreferences: boolean
  selectedPreference: string
  displayRouteTypesToAvoid: boolean
  selectedRouteTypesToAvoid: string[]
  selectableRouteTypesToAvoid: Selectable[]
  searchResults: Array<object>
}

export interface RoutingGetters extends RoutingState {
  configuration: RoutingConfiguration
  searchConfiguration: RoutingSearchConfiguration | null
  url: string
}
