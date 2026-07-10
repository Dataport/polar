import type { Category, CategoryValue, FilterState } from '../types'

import { acceptHMRUpdate, defineStore } from 'pinia'

import { flattenValue } from '../utils/flattenAndExpandValue'
import { useFilterMainStore } from './main'

export const useFilterCategoryStore = defineStore(
	'plugins/filter/category',
	() => {
		const filterMainStore = useFilterMainStore()

		function createMissingObjects(targetProperty: string) {
			// The state is created automatically and this component is only used when a layer is selected.
			const layerState = filterMainStore.selectedLayerState as FilterState
			layerState.knownValues ??= {}
			return (layerState.knownValues[targetProperty] ??= Object.fromEntries(
				filterMainStore.selectedLayerConfiguration.categories
					?.find((category) => category.targetProperty === targetProperty)
					?.knownValues.map((value) => [flattenValue(value), true]) ?? []
			))
		}

		function getStatus(targetProperty: string, { values }: CategoryValue) {
			return Object.entries(
				filterMainStore.selectedLayerState?.knownValues?.[targetProperty] ?? {}
			)
				.filter(([value]) => values.includes(value))
				.every(([, status]) => status)
		}

		function setStatus(
			targetProperty: string,
			{ values }: CategoryValue,
			newValue: boolean
		) {
			const valueState = createMissingObjects(targetProperty)
			values.forEach((value) => (valueState[value] = newValue))
		}

		function selectOrDeselectAll(category: Category) {
			const valueState = createMissingObjects(category.targetProperty)
			const categoryValues = category.knownValues.flatMap((entry) =>
				typeof entry === 'string' ? [entry] : entry.values
			)
			const newStatus =
				Object.values(valueState).filter((selected) => selected).length !==
				categoryValues.length
			categoryValues.forEach((value) => (valueState[value] = newStatus))
		}

		return {
			getStatus,
			setStatus,
			selectOrDeselectAll,
		}
	}
)

if (import.meta.hot) {
	import.meta.hot.accept(
		acceptHMRUpdate(useFilterCategoryStore, import.meta.hot)
	)
}
