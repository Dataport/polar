import { Map, Feature } from 'ol'
import { Coordinate } from 'ol/coordinate'
import { SourceType } from 'ol/layer/WebGLTile'
import { LayerType } from 'ol/renderer/webgl/TileLayer'
import LayerRenderer from 'ol/renderer/Layer'
import { Layer } from 'ol/layer'
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
  layer: Layer<SourceType, LayerRenderer<LayerType>>
  coordinate: Coordinate
  layerConfiguration: GfiLayerConfiguration
  /** rawLayerList entry, see https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/doc/services.json.md */
  layerSpecification: Record<string, unknown>
  /** defaults to bboxDot (get from minimal coordinate bbox) */
  mode?: 'bboxDot' | 'intersects' // TODO: Might be interesting to rather define this per service
}

/** GFI Vuex Module State */
export interface GfiState {
  /** mapping of layer id to features found for last GFI call */
  featureInformation: Record<string, GeoJsonFeature[]>
  /** currently visible feature index regarding  */
  visibleWindowFeatureIndex: number
  /** count up if something in relevant features changed */
  visibilityChangeIndicator: number
  /** default style for stroke and fill of the highlighted feature. */
  defaultHighlightStyle: HighlightStyle
  page: number
}

export interface GfiGetters extends GfiState {
  afterLoadFunction: GfiAfterLoadFunction | null
  exportPropertyLayerKeys: Record<string, string>
  /** module configuration */
  gfiConfiguration: GfiConfiguration
  /** all layer keys to retrieve GFI information for */
  layerKeys: string[]
  renderType: RenderType
  /** subset of layerKeys, where features' properties are to be shown in UI */
  windowLayerKeys: string[]
  /**
   * features' properties from featureInformation where windowLayerKeys
   * includes the key of the layer
   */
  windowFeatures: GeoJsonProperties[]
  /** subset of layerKeys, where features' geometries are to be shown on map */
  geometryLayerKeys: string[]
  windowLayerKeysActive: boolean
  listMode: FeatureList['mode'] | undefined
  listText: FeatureList['text']
  showList: boolean
  listFeatures: Feature[]
}
