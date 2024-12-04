// TODO: entscheiden, ob ich die LayerConfiguration brauche
import { Feature, FeatureCollection } from 'geojson'
import VectorSource from 'ol/source/Vector'
import { StyleLike } from 'ol/style/Style'
import { RoutingConfiguration } from '@polar/lib-custom-types'
import { Coordinate } from 'ol/coordinate'

// The options that can be given to an ol/VectorLayer. Somehow the direct import from ol doesn't work.
// This is a copy with the things that we currently use
export interface PolarVectorOptions {
  source?: VectorSource
  style?: StyleLike
}

// TODO: entscheiden, ob ich den IdManipulator brauche
export type IdManipulator = (ids: (string | number)[]) => (number | string)[]

export interface FeatureIndexZip {
  value: FeatureCollection
  index: number
}

export interface RoutingState {
  start: Coordinate
  startAddress: string
  end: Coordinate
  endAddress: string
  renderType: string
  selectedTravelMode: string
  selectableTravelModes: []
  displayPreference: boolean
  selectedPreference: string
  selectablePreferences: []
  displayRouteTypesToAvoid: boolean
  selectedRouteTypesToAvoid: []
  selectableRouteTypesToAvoid: []
  serviceID: string
  numberOfKeysToTriggerSearch: number
  // TODO: überprüfen, ob diese Angaben richtig sind:
  /**
   * Found features with groupIndex in selected group or a symbol indicating that
   * a) an error occurred
   * b) nothing has been search yet
   * FeatureIndexZip[] | symbol
   */
  searchResponseData: object
  mousePosition: []
}

export interface RoutingGetters extends RoutingState {
  start: Coordinate
  end: Coordinate
  renderType: string
  selectedTravelMode: string
  selectableTravelModes: []
  selectedPreference: string
  selectablePreferences: []
  displayRouteTypesToAvoid: boolean
  selectedRouteTypesToAvoid: []
  selectableRouteTypesToAvoid: []
  serviceID: string
  numberOfKeysToTriggerSearch: number
  searchResponseData: object
  routingConfiguration: RoutingConfiguration
  mousePosition: []
}

// TODO: entscheiden, ob ich das brauche
export interface FeatureListWithCategory {
  features: Feature[]
  categoryId: string
  category: string
}
