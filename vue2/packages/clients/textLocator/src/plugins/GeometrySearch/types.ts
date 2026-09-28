import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from 'geojson'
import { TitleLocationFrequency } from '../../types'
import { ResponseGeom, ResponseName } from '../../utils/coastalGazetteer/types'

export type TextLocatorCategories = 'text' | 'toponym'

export interface TreeViewItem {
  id: string
  name: string
  count: number
  children?: TreeViewItem[]
  feature?: Feature
  type: TextLocatorCategories
}

export type GeometrySearchFeatureProperties = GeoJsonProperties & {
  title: string
  // using only implemented gazetteer's type for now – on extension, this may require a broader type
  names: ResponseName[]
  geometries: ResponseGeom[]
}

export interface GeometrySearchState {
  featureCollection: FeatureCollection<
    Geometry,
    GeometrySearchFeatureProperties
  >
  titleLocationFrequency: TitleLocationFrequency
  byCategory: TextLocatorCategories
  lastSearch: 'geometrySearch' | 'literatureSearch' | 'toponymSearch' | null
}

export type GeometrySearchGetters = GeometrySearchState

export type FeatureType =
  | 'fallback'
  | 'roughBackground'
  | 'fineBackground'
  | 'wattenmeer'
  | 'detail'
