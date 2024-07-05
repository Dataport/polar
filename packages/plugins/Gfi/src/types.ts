import { Map, Feature } from 'ol'
import { Coordinate } from 'ol/coordinate'
import { Layer } from 'ol/layer'
import { Source } from 'ol/source'
import VectorSource from 'ol/source/Vector'
import { Feature as GeoJsonFeature, GeoJsonProperties } from 'geojson'
import {
  HighlightStyle,
  GfiAfterLoadFunction,
  GfiConfiguration,
  GfiLayerConfiguration,
  RenderType,
  FeatureList,
} from '@polar/lib-custom-types'

/** parameter specification for request method */
export interface RequestGfiParameters {
  map: Map
  layer: Layer<Source>
  coordinate: Coordinate
  layerConfiguration: GfiLayerConfiguration
  /** rawLayerList entry, see https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/doc/services.json.md */
  layerSpecification: Record<string, unknown>
  /** defaults to bboxDot (get from minimal coordinate bbox) */
  mode?: 'bboxDot' | 'intersects' // TODO: Might be interesting to rather define this per service
}

/** GFI Vuex Module State */
export interface GfiState {
  /** default style for stroke and fill of the highlighted feature. */
  defaultHighlightStyle: HighlightStyle
  /** mapping of layer id to features found for last GFI call */
  featureInformation: Record<string, GeoJsonFeature[]>
  imageLoaded: boolean
  page: number
  /** currently visible feature index regarding  */
  visibleWindowFeatureIndex: number
  /** count up if something in relevant features changed */
  visibilityChangeIndicator: number
}

export interface GfiGetters extends GfiState {
  afterLoadFunction: GfiAfterLoadFunction | null
  currentProperties: GeoJsonProperties
  exportProperty: string
  exportPropertyLayerKeys: Record<string, string>
  /** subset of layerKeys, where features' geometries are to be shown on map */
  geometryLayerKeys: string[]
  /** module configuration */
  gfiConfiguration: GfiConfiguration
  isFeatureHovered: (feature: Feature) => boolean
  /** all layer keys to retrieve GFI information for */
  layerKeys: string[]
  listableLayerSources: VectorSource[]
  listFeatures: Feature[]
  listMode: FeatureList['mode'] | undefined
  listText: FeatureList['text']
  renderMoveHandle: boolean
  renderType: RenderType
  showList: boolean
  showSwitchButtons: boolean
  /** subset of layerKeys, where features' properties are to be shown in UI */
  windowLayerKeys: string[]
  /**
   * features' properties from featureInformation where windowLayerKeys
   * includes the key of the layer
   */
  windowFeatures: GeoJsonProperties[]
  windowLayerKeysActive: boolean
}
