import { generateSimpleGetters } from '@repositoryname/vuex-generators'
import {
	LayerConfigurationOptionLayers,
	PolarModule,
} from '@polar/lib-custom-types'
import { rawLayerList } from '@masterportal/masterportalapi'
import { ImageWMS, TileWMS } from 'ol/source'
import Layer from 'ol/layer/Layer'
import { LayerChooserGetters, LayerChooserState } from '../types'
import { getOpenedOptionsServiceLayers } from '../utils/getOpenedOptionsServiceLayers'

export const getInitialState = (): LayerChooserState => ({
	backgrounds: [],
	masks: [],
})

export const makeStoreModule = () => {
	const storeModule: PolarModule<LayerChooserState, LayerChooserGetters> = {
		namespaced: true,
		state: getInitialState(),
		actions: {
			toggleOpenedOptionsServiceLayer(
				{
					commit,
					rootGetters,
					getters: {
						openedOptionsService,
						openedOptionsServiceLayers,
						activeLayerIds,
					},
				},
				value
			) {
				// keep configured layer order - vuetify puts last activated last
				const sortedValue =
					openedOptionsServiceLayers === null
						? value
						: openedOptionsServiceLayers
								.filter(({ layerName }) => value.includes(layerName))
								.map(({ layerName }) => layerName)
								.reverse()
				const olLayer = rootGetters.map
					.getLayers()
					.getArray()
					.find((l) => l.get('id') === openedOptionsService.id) as Layer<
					ImageWMS | TileWMS
				>
				const olSource = olLayer?.getSource?.()

				if (!olLayer || !olSource) {
					console.error(
						`@polar/plugin-layer-chooser: Action 'toggleOpenedOptionsServiceLayer' failed on ${openedOptionsService.id} with value ${sortedValue}. Layer not found in OL, or source not initialized in OL.`
					)
					return
				}

				const updatedParams = { ...olSource.getParams(), LAYERS: sortedValue }

				olSource.updateParams(updatedParams)
				commit('setActiveLayerIds', {
					...activeLayerIds,
					[openedOptionsService.id]: sortedValue,
				})
			},
		},
		getters: {
			...generateSimpleGetters(getInitialState()),
			idsWithOptions(_, { backgrounds, masks }) {
				return [...backgrounds, ...masks]
					.filter((layer) => Boolean(layer.options))
					.map((layer) => layer.id)
			},
			openedOptionsService(_, { backgrounds, masks, openedOptions }) {
				return [...backgrounds, ...masks].find(
					(service) => service.id === openedOptions
				)
			},
			openedOptionsServiceLayers(_, { openedOptionsService }, __, rootGetters) {
				const layers: LayerConfigurationOptionLayers | undefined =
					openedOptionsService?.options?.layers

				if (typeof layers === 'undefined') {
					return null
				}

				const serviceDefinition = rawLayerList.getLayerWhere({
					id: openedOptionsService.id,
				})

				if (!serviceDefinition.layers) {
					console.error(
						'@polar/plugin-layer-chooser: Trying to configure layers of a layer without "layers" field.',
						serviceDefinition
					)
					return null
				}

				const wmsCapabilitiesJson = rootGetters?.[
					'capabilities/wmsCapabilitiesAsJsonById'
				](openedOptionsService.id)

				if (wmsCapabilitiesJson === null) {
					console.error(
						`@polar/plugin-layer-chooser: CapabilitiesJson for layer ${JSON.stringify(
							openedOptionsService
						)} is null.`
					)
					return null
				}

				return getOpenedOptionsServiceLayers(
					layers.order?.split?.(',') || serviceDefinition.layers.split(','),
					layers,
					wmsCapabilitiesJson
				)
			},
			shownMasks({ masks }) {
				return masks.filter(({ hideInMenu }) => !hideInMenu)
			},
		},
	}

	return storeModule
}
