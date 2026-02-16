import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import { useCoreStore } from '@/core/stores'

import {
	PluginId,
	type FilterConfiguration,
	type FilterPluginOptions,
	type FilterState,
} from '../types'

export const useFilterMainStore = defineStore('plugins/filter/main', () => {
	const coreStore = useCoreStore()

	const configuration = computed(
		() =>
			(coreStore.configuration[PluginId] ?? {
				layers: {},
			}) as FilterPluginOptions
	)

	const state = ref<Record<string, FilterState>>({})

	const layers = computed(() =>
		Object.entries(configuration.value.layers).map(
			([layerId, filterConfiguration]) => ({
				layerId,
				layerConfiguration: coreStore.getLayerMapConfiguration(layerId),
				filterConfiguration,
			})
		)
	)

	const selectedLayerId = ref<string | null>(null)
	watch(selectedLayerId, (newLayerId) => {
		if (newLayerId === null || state.value[newLayerId]) {
			return
		}
		state.value[newLayerId] = {}
	})
	watch(
		() => configuration.value.layers,
		(layers) => {
			selectedLayerId.value = Object.keys(layers)[0] || ''
		},
		{ immediate: true, deep: true }
	)

	const selectedLayer = computed(
		() =>
			layers.value.find((layer) => layer.layerId === selectedLayerId.value) ??
			null
	)

	const selectedLayerConfiguration = computed(
		() =>
			(selectedLayerId.value
				? configuration.value.layers[selectedLayerId.value]
				: {}) as FilterConfiguration
	)

	const selectedLayerState = computed(
		() =>
			(selectedLayerId.value
				? state.value[selectedLayerId.value]
				: null) as FilterState | null
	)

	const selectedLayerHasTimeFilter = computed(
		() =>
			selectedLayerConfiguration.value.time?.last ||
			selectedLayerConfiguration.value.time?.next ||
			selectedLayerConfiguration.value.time?.freeSelection
	)

	const filteredLayers = computed(() =>
		coreStore.map
			.getAllLayers()
			.filter((layer) =>
				Object.keys(configuration.value.layers).includes(layer.get('id'))
			)
	)

	return {
		configuration,
		state,
		layers,
		selectedLayerId,
		selectedLayer,
		selectedLayerConfiguration,
		selectedLayerState,
		selectedLayerHasTimeFilter,
		filteredLayers,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useFilterMainStore, import.meta.hot))
}
