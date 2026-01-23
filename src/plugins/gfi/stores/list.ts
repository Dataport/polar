import type { Feature as GeoJsonFeature } from 'geojson'
import type { Feature } from 'ol'

import { rawLayerList } from '@masterportal/masterportalapi'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, watch, type WatchHandle } from 'vue'

import { useCoreStore } from '@/core/stores'
import { getRefStore } from '@/lib/getRefStore'
import { getVectorSource } from '@/lib/getVectorSource'
import { isVisible } from '@/lib/invisibleStyle'

import { PluginId, type GfiPluginOptions } from '../types'
import { requestGfi } from '../utils/requestGfi'
import { serializeFeature } from '../utils/serializeFeature'
import { useGfiMainStore } from './main'

export const useGfiListStore = defineStore('plugins/gfi/list', () => {
	const coreStore = useCoreStore()
	const gfiMainStore = useGfiMainStore()

	const configuration = computed(() => gfiMainStore.configuration.featureList)

	const activeLayers = computed(() => {
		if (!configuration.value) {
			return []
		}

		const activeLayersRef = configuration.value.activeLayers
		const store = getRefStore(activeLayersRef)
		if (!store) {
			return []
		}
		return store[activeLayersRef.key] as string[]
	})

	const features = computed(() => {
		// We want to re-calculate on extent changes, as the features change then.
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		coreStore.extent

		// TODO: We also want to re-calculate when the features are actually loaded.
		// Currently, we need an extent change to reload the list.

		return Object.fromEntries(
			activeLayers.value
				.map((layerId) => ({
					layerId,
					layerConfiguration: gfiMainStore.getLayerConfiguration(layerId),
					layer: coreStore.getLayer(layerId),
				}))
				.filter(
					(
						layer
					): layer is {
						[K in keyof typeof layer]: NonNullable<(typeof layer)[K]>
					} => Boolean(layer.layerConfiguration) && Boolean(layer.layer)
				)
				.map(({ layerId, layerConfiguration, layer }) => {
					const source = getVectorSource(layer)

					return [
						layerId,
						(configuration.value?.mode === 'loaded'
							? source.getFeatures()
							: source.getFeaturesInExtent(
									coreStore.map
										.getView()
										.calculateExtent(coreStore.map.getSize()),
									coreStore.map.getView().getProjection()
								)
						)
							.filter((feature) => isVisible(feature))
							.filter(
								(feature) =>
									!layerConfiguration.isSelectable ||
									layerConfiguration.isSelectable(serializeFeature(feature))
							)
							.map((feature) => ({
								feature,
								...(configuration.value.featureList?.bindWithCoreHoverSelect
									? {
											hovered:
												coreStore.hoveredFeature === feature ||
												coreStore.hoveredFeature
													?.get('features')
													?.includes(feature),
										}
									: {}),
							})),
					]
				})
				.filter(
					(
						layer
					): layer is [string, { feature: Feature; hovered?: boolean }[]] =>
						Boolean(layer)
				)
		)
	})

	return {
		features,
	}
})
mport.meta.hot.accept(acceptHMRUpdate(useGfiListStore, import.meta.hot))
}
