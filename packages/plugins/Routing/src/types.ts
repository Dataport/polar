import {
  type RoutingConfiguration,
  RoutingSearchConfiguration,
} from '@polar/lib-custom-types'
import { type Coordinate } from 'ol/coordinate'

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
