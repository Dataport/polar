import { Mutation, MutationTree } from 'vuex'
import { FeatureCollection } from 'geojson'
import { Feature } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { StyleLike } from 'ol/style/Style'
import {
  DrawConfiguration,
  DrawMode,
  MeasureMode,
  MeasureOptions,
} from '@polar/lib-custom-types'

// The options that can be given to an ol/VectorLayer. Somehow the direct import from ol doesn't work.
// This is a copy with the things that we currently use
export interface PolarVectorOptions {
  source?: VectorSource
  style?: StyleLike
}

export type Mode = 'none' | 'draw' | 'edit' | 'translate' | 'delete' | 'lasso'

export interface CreateInteractionsPayload {
  drawSource: VectorSource
  drawLayer: VectorLayer
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
  measureMode: MeasureMode
}

export interface DrawGetters extends Omit<DrawState, 'selectedFeature'> {
  selectableDrawModes: { [k in DrawMode]?: string }
  selectedFeature: Feature
  selectableModes: { [k in Mode]: string }
  selectableMeasureModes: { [k in MeasureMode]?: string }
  showTextInput: boolean
  configuration: DrawConfiguration
  fontSizes: number[]
  measureOptions: MeasureOptions
  showSizeSlider: boolean
  /* actual text size to use */
  textSize: number
  showDrawOptions: boolean
  showMeasureOptions: boolean
}

export interface DrawMutations extends MutationTree<DrawState> {
  setDrawMode: Mutation<DrawState>
  setMode: Mutation<DrawState>
  updateFeatures: Mutation<DrawState>
}
