import type {
  RoutingConfiguration,
  SelectableTravelMode,
} from '@polar/lib-custom-types'
import { type Coordinate } from 'ol/coordinate'
import { FeatureCollection, LineString } from 'geojson'

type SelectablePreference = 'recommended' | 'fastest' | 'shortest'

interface Selectable {
  key: string
  locale: string
}

export interface RoutingState {
  currentlyFocusedInput: number
  route: Coordinate[]
  routingResponseData: FeatureCollection<LineString>
  selectableRouteTypesToAvoid: Selectable[]
  selectedPreference: SelectablePreference
  selectedRouteTypesToAvoid: string[]
  selectedTravelMode: SelectableTravelMode
  showSteps: boolean
}

export interface RoutingGetters extends RoutingState {
  configuration: RoutingConfiguration
  displayPreferences: boolean
  displayRouteTypesToAvoid: boolean
  routeAsWGS84: Coordinate[]
  selectableTravelModes: SelectableTravelMode[]
  url: string
}
