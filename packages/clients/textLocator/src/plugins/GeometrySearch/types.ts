import { FeatureCollection } from 'geojson'
import { TitleLocationFrequency } from '../../utils/literatureByToponym'

export type TextLocatorCategories = 'text' | 'toponym'

export interface TreeViewItem {
  id: string
  name: string
  count: number
  children?: TreeViewItem[]
}

export interface GeometrySearchState {
  featureCollection: FeatureCollection
  titleLocationFrequency: TitleLocationFrequency
  byCategory: TextLocatorCategories
}

export type GeometrySearchGetters = GeometrySearchState
