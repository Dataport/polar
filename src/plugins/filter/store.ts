/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/filter/store
 */
/* eslint-enable tsdoc/syntax */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import { useCoreStore } from '@/core/stores'
import { getVectorSource } from '@/lib/getVectorSource'

import {
	PluginId,
	type FilterConfiguration,
	type FilterPluginOptions,
	type FilterState,
} from './types'
import { updateFeatureVisibility } from './utils/updateFeatureVisibility'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for filtering features.
 */
/* eslint-enable tsdoc/syntax */
export const useFilterStore = defineStore('plugins/filter', () => {
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
				layerConfiguration: coreStore.getLayerConfiguration(layerId),
				filterConfiguration,
			})
		)
	)

	const selectedLayerId = ref<string | null>(null)
	watch(selectedLayerId, (newLayerId) => {
		if (newLayerId === null) {
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
				: null) as FilterState
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

	const teardownCallbacks = [] as (() => void)[]

	function setupPlugin() {
		filteredLayers.value.forEach((layer) => {
			const source = getVectorSource(layer)
			const callback = () => {
				updateFeatureVisibility(source, state.value[layer.get('id')] ?? {})
			}
			source.on('featuresloadend', callback)
			teardownCallbacks.push(() => {
				source.un('featuresloadend', callback)
			})
			teardownCallbacks.push(
				watch(
					() => state.value[layer.get('id')],
					() => {
						callback()
					},
					{ deep: true, immediate: true }
				)
			)
		})
	}

	function teardownPlugin() {
		teardownCallbacks.forEach((callback) => {
			callback()
		})
	}

	return {
		/**
		 * Flat list of filterable layers.
		 *
		 * @alpha
		 */
		layers,

		/**
		 * ID of the selected layer.
		 *
		 * @alpha
		 */
		selectedLayerId,

		/**
		 * Information on the selected layer.
		 *
		 * @alpha
		 */
		selectedLayer,

		/**
		 * Configuration of the selected layer w.r.t. filter.
		 * If no layer is selected, the configuration is an empty object.
		 *
		 * @alpha
		 */
		selectedLayerConfiguration,

		/**
		 * State of the selected layer w.r.t. filter.
		 * If no layer is selected, the state is `null`.
		 *
		 * @alpha
		 */
		selectedLayerState,

		/**
		 * `true` if the selected layer allows filtering for time.
		 *
		 * @alpha
		 */
		selectedLayerHasTimeFilter,

		/** @internal */
		configuration,

		/** @internal */
		state,

		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useFilterStore, import.meta.hot))
}
