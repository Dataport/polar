import { LayerConfiguration } from '@polar/lib-custom-types'

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
  disabledBackgrounds: boolean[]
  disabledMasks: []
  shownMasks: []
  idsWithOptions: string[]
  openedOptionsService: LayerConfiguration
  openedOptionsServiceLayers: LayerOption[] | null
}

export interface LayerOption {
  displayName: string
  layerName: string
  layerImage: string | null
}
