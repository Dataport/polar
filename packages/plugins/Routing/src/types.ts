// TODO: entscheiden, ob ich die LayerConfiguration brauche
import { Feature, FeatureCollection, RoutingConfiguration } from 'geojson'

// TODO: entscheiden, ob ich den IdManipulator brauche
export type IdManipulator = (ids: (string | number)[]) => (number | string)[]

export interface FeatureIndexZip {
  value: FeatureCollection
  index: number
}

export interface RoutingState {
  route: string[]
  selectedTravelMode: string
  selectableTravelModes: []
  displayPreference: boolean
  selectedPreference: string
  selectablePreferences: []
  displayRouteTypesToAvoid: boolean
  selectableRouteTypesToAvoid: []
  selectedRouteTypesToAvoid: []
  serviceID: string
  numberOfKeysToTriggerSearch: number
  // TODO: überprüfen, ob diese Angaben richtig sind:
  /**
   * Found features with groupIndex in selected group or a symbol indicating that
   * a) an error occurred
   * b) nothing has been search yet
   * FeatureIndexZip[] | symbol
   */
  searchResults: string[]
}

export interface RoutingGetters extends RoutingState {
  routingConfiguration: RoutingConfiguration
  route: string[]
  renderType: string
  selectedTravelMode: string
  selectedPreference: string
  travelModeOptionsFromMapConfig: string[]
  preferenceOptionsFromMapConfig: string[]
}

// TODO: entscheiden, ob ich das brauche
export interface FeatureListWithCategory {
  features: Feature[]
  categoryId: string
  category: string
}
