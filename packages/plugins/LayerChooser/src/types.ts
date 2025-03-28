import { LayerConfiguration } from '@polar/lib-custom-types'
import { VueConstructor } from 'vue'

export type IdManipulator = (ids: (string | number)[]) => (number | string)[]

export interface LayerChooserState {
  /** null indicates no options are open; string is layer ID of opened opts */
  openedOptions: null | string
  backgrounds: LayerConfiguration[]
  availableBackgrounds: LayerConfiguration[]
  availableMasks: LayerConfiguration[]
  masks: LayerConfiguration[]
  activeBackgroundId: string
  activeMaskIds: string[]
  /** maps layer id to its currently active layers by name
   * only kept track of when layer's layers are configurable */
  activeLayerIds: Record<string, string[]>
}

export interface LayerChooserGetters extends LayerChooserState {
  component: VueConstructor | null
  disabledBackgrounds: boolean[]
  disabledMasks: boolean[]
  idsWithOptions: string[]
  masksSeparatedByType: Record<string, LayerConfiguration[]>
  openedOptionsService: LayerConfiguration
  openedOptionsServiceLayers: LayerOption[] | null
  shownMasks: LayerConfiguration[]
}

export interface LayerOption {
  displayName: string
  layerName: string
  layerImage: string | null
}
