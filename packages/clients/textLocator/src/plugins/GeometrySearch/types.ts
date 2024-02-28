import { FeatureCollection } from 'geojson'
import { TitleLocationFrequency } from '../../utils/literatureByToponym'

export type TextLocatorDrawModes = 'Point' | 'Polygon'
export type TextLocatorCategories = 'text' | 'toponym'

export interface GeometrySearchState {
  featureCollection: FeatureCollection
  titleLocationFrequency: TitleLocationFrequency
  draw: TextLocatorDrawModes
  byCategory: TextLocatorCategories
}

export type GeometrySearchGetters = GeometrySearchState
