import type {
	Category,
	CategoryWithSelection,
	FilterConfiguration,
	FilterPluginOptions,
	FilterState,
} from '../types'

import { union } from 'es-toolkit'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import { useCoreStore } from '@/core/stores'

import { PluginId } from '../types'
import {
	expandValue,
	flattenValue,
	getAllTechnicalValues,
} from '../utils/categoryValues'
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
	watch(
		() => configuration.value.layers,
		(layers) => {
			Object.keys(layers).forEach((layerId) => {
				state.value[layerId] ??= { knownValues: {} }
			})
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

	/**
	 * Initializes the filter state for all categories of the selected layer.
	 * Runs whenever the selected layer (or its category configuration) changes,
	 * so layers or categories configured at runtime are covered as well.
	 * Existing selections persist: only targetProperties not yet present are
	 * seeded, so previously deselected values are not re-added on layer switch.
	 */
	watch(
		() => selectedLayerConfiguration.value.categories,
		(categories) => {
			const layerState = selectedLayerState.value
			if (!categories || !layerState) {
				return
			}
			// Aggregate default values per targetProperty first, so multiple
			// categories sharing a targetProperty are merged instead of the
			// later one overwriting the earlier.
			const defaults: Record<string, string[]> = {}
			for (const category of categories) {
				defaults[category.targetProperty] = union(
					defaults[category.targetProperty] ?? [],
					getAllTechnicalValues(category)
				)
			}
			// Only seed targetProperties that are not present yet, so existing
			// (de)selections persist across layer switches.
			for (const [targetProperty, values] of Object.entries(defaults)) {
				layerState.knownValues[targetProperty] ??= values
			}
		},
		{ immediate: true }
	)

	const categories = computed<CategoryWithSelection[]>(
		() =>
			selectedLayerConfiguration.value.categories?.map((category) => ({
				...category,
				get selection() {
					const stateValues =
						selectedLayerState.value?.knownValues[category.targetProperty] ?? []
					return category.knownValues
						.filter((entry) =>
							expandValue(entry).values.every((v) => stateValues.includes(v))
						)
						.map(flattenValue)
				},
				set selection(selectedKeys: string[]) {
					const layerState = selectedLayerState.value as FilterState
					const allMyValues = getAllTechnicalValues(category)
					const newMyValues = selectedKeys.flatMap((key) => {
						const entry = category.knownValues.find(
							(v) => flattenValue(v) === key
						)
						return entry ? expandValue(entry).values : [key]
					})
					const current = layerState.knownValues[category.targetProperty] ?? []
					const othersValues = current.filter((v) => !allMyValues.includes(v))
					layerState.knownValues[category.targetProperty] = union(
						othersValues,
						newMyValues
					)
				},
			})) ?? []
	)

	function selectOrDeselectAll(category: Category) {
		const layerState = selectedLayerState.value as FilterState
		const stateValues = layerState.knownValues[category.targetProperty] ?? []
		const allMyValues = getAllTechnicalValues(category)
		const allSelected = allMyValues.every((v) => stateValues.includes(v))
		if (allSelected) {
			layerState.knownValues[category.targetProperty] = stateValues.filter(
				(v) => !allMyValues.includes(v)
			)
		} else {
			layerState.knownValues[category.targetProperty] = union(
				stateValues,
				allMyValues
			)
		}
	}

	return {
		categories,
		configuration,
		state,
		layers,
		selectedLayerId,
		selectedLayer,
		selectedLayerConfiguration,
		selectedLayerState,
		selectedLayerHasTimeFilter,
		filteredLayers,
		selectOrDeselectAll,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useFilterMainStore, import.meta.hot))
}
