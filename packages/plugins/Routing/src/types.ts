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
  searchResponseData: object
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
  searchResponseData: object
  mousePosition: Coordinate
  routingConfiguration: RoutingConfiguration
}

// TODO: entscheiden, ob ich das brauche
export interface FeatureListWithCategory {
  features: Feature[]
  categoryId: string
  category: string
}
