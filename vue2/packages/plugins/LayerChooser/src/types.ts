import { LayerConfiguration } from '@polar/lib-custom-types'
import { VueConstructor } from 'vue'

export type DisabledLayers = Record<string, boolean>

export interface LayerChooserState {
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
	disabledBackgrounds: DisabledLayers
	disabledMasks: DisabledLayers
	displayOptionsForType: Record<string, boolean>
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
