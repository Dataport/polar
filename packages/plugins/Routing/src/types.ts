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
  selectedTravelMode:
    | 'driving-car'
    | 'driving-hgv'
    | 'cycling-regular'
    | 'foot-walking'
    | 'wheelchair'
  displayPreferences: boolean
  selectedPreference: 'recommended' | 'fastest' | 'shortest'
  displayRouteTypesToAvoid: boolean
  selectedRouteTypesToAvoid: string[]
  selectableRouteTypesToAvoid: Selectable[]
  searchResults: Array<object>
  routingResponseData: Record<string, any>
}

export interface RoutingGetters extends RoutingState {
  configuration: RoutingConfiguration
  routeAsWGS84: Coordinate[]
  searchConfiguration: RoutingSearchConfiguration | null
  url: string
}
