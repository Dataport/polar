import { Mutation, MutationTree } from 'vuex'
import { FeatureCollection } from 'geojson'
import { Feature } from 'ol'
import Geometry from 'ol/geom/Geometry'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { StyleLike } from 'ol/style/Style'
import { DrawConfiguration, DrawMode } from '@polar/lib-custom-types'

// The options that can be given to an ol/VectorLayer. Somehow the direct import from ol doesn't work.
// This is a copy with the things that we currently use
export interface PolarVectorOptions {
  source?: VectorSource<Geometry>
  style?: StyleLike
}

export type Mode = 'none' | 'draw' | 'edit' | 'delete'

export interface CreateInteractionsPayload {
  drawSource: VectorSource
  drawLayer: VectorLayer<VectorSource>
}

export interface DrawState {
  mode: Mode
  drawMode: DrawMode
  textInput: string
  selectedStrokeColor: string
  /* index in array of available sizes */
  selectedSize: number
  featureCollection: FeatureCollection
  selectedFeature: number
}

export interface DrawGetters extends Omit<DrawState, 'selectedFeature'> {
  selectableDrawModes: DrawMode[]
  selectedFeature: Feature
  selectableModes: Mode[]
  selectedStrokeColor: string
  showTextInput: boolean
  configuration: DrawConfiguration
  fontSizes: number[]
  showSizeSlider: boolean
  /* actual text size to use */
  textSize: number
}

export interface DrawMutations extends MutationTree<DrawState> {
  setDrawMode: Mutation<DrawState>
  setMode: Mutation<DrawState>
  updateFeatures: Mutation<DrawState>
}
