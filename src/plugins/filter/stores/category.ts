import type { Category, FilterState } from '../types'

import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, watch } from 'vue'

import { expandValue, flattenValue } from '../utils/flattenAndExpandValue'
import { useFilterMainStore } from './main'

export interface CategoryWithSelection extends Category {
	selection: string[]
}

function getAllTechnicalValues(category: Category): string[] {
	return category.knownValues.flatMap((v) => expandValue(v).values)
}

function uniqueConcat(...arrays: string[][]): string[] {
	return [...new Set(arrays.flat())]
}

export const useFilterCategoryStore = defineStore(
	'plugins/filter/category',
	() => {
		const filterMainStore = useFilterMainStore()

		/**
		 * Initializes the filter state for all categories of the selected layer.
		 * On (re-)selection of a layer, all known values are added to the state,
		 * ensuring all features are visible by default. Previously deselected
		 * values are re-added intentionally to reset the filter on layer switch.
		 */
		watch(
			() => filterMainStore.selectedLayerConfiguration.categories,
			(categories) => {
				const state = filterMainStore.selectedLayerState
				if (!categories || !state) {
					return
				}
				state.knownValues ??= {}
				for (const category of categories) {
					state.knownValues[category.targetProperty] = uniqueConcat(
						state.knownValues[category.targetProperty] ?? [],
						getAllTechnicalValues(category)
					)
				}
			},
			{ immediate: true }
		)

		const categories = computed<CategoryWithSelection[]>(
			() =>
				filterMainStore.selectedLayerConfiguration.categories?.map(
					(category) => ({
						...category,
						get selection() {
							const stateValues =
								filterMainStore.selectedLayerState?.knownValues?.[
									category.targetProperty
								] ?? []
							return category.knownValues
								.filter((entry) =>
									expandValue(entry).values.every((v) =>
										stateValues.includes(v)
									)
								)
								.map(flattenValue)
						},
						set selection(selectedKeys: string[]) {
							const state = filterMainStore.selectedLayerState as FilterState
							state.knownValues ??= {}
							const allMyValues = getAllTechnicalValues(category)
							const newMyValues = selectedKeys.flatMap((key) => {
								const entry = category.knownValues.find(
									(v) => flattenValue(v) === key
								)
								return entry ? expandValue(entry).values : [key]
							})
							const current = state.knownValues[category.targetProperty] ?? []
							const othersValues = current.filter(
								(v) => !allMyValues.includes(v)
							)
							state.knownValues[category.targetProperty] = uniqueConcat(
								othersValues,
								newMyValues
							)
						},
					})
				) ?? []
		)

		function selectOrDeselectAll(category: Category) {
			const state = filterMainStore.selectedLayerState as FilterState
			state.knownValues ??= {}
			const stateValues = state.knownValues[category.targetProperty] ?? []
			const allMyValues = getAllTechnicalValues(category)
			const allSelected = allMyValues.every((v) => stateValues.includes(v))
			if (allSelected) {
				state.knownValues[category.targetProperty] = stateValues.filter(
					(v) => !allMyValues.includes(v)
				)
			} else {
				state.knownValues[category.targetProperty] = uniqueConcat(
					stateValues,
					allMyValues
				)
			}
		}

		return {
			categories,
			selectOrDeselectAll,
		}
	}
)

if (import.meta.hot) {
	import.meta.hot.accept(
		acceptHMRUpdate(useFilterCategoryStore, import.meta.hot)
	)
}
