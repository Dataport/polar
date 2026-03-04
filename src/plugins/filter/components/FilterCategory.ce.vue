<template>
	<FilterSection
		v-for="(category, idx) of filterStore.selectedLayerConfiguration.categories"
		:key="idx"
		:title="
			$t(
				($) =>
					$['layer'][filterStore.selectedLayerId]['category'][
						category.targetProperty
					]['title'],
				{ ns: PluginId, defaultValue: category.targetProperty }
			)
		"
	>
		<div class="polar-filter-category-values">
			<KernBlockButton
				v-if="category.selectAll"
				icon="kern-icon--deselect"
				:label="$t(($) => $.category.deselectAll, { ns: PluginId })"
				@click="selectOrDeselectAll(category)"
			/>
			<component
				:is="
					coreStore.layout === 'standard'
						? KernBlockButtonCheckbox
						: KernCheckbox
				"
				v-for="categoryValue of category.knownValues"
				:key="flattenValue(categoryValue)"
				:icon="typeof categoryValue !== 'string' && categoryValue.icon"
				:label="
					$t(
						($) =>
							$['layer'][filterStore.selectedLayerId]['category'][
								category.targetProperty
							]['knownValue'][flattenValue(categoryValue)],
						{ ns: PluginId, defaultValue: flattenValue(categoryValue) }
					)
				"
				:model-value="
					getStatus(category.targetProperty, expandValue(categoryValue))
				"
				@update:model-value="
					setStatus(category.targetProperty, expandValue(categoryValue), $event)
				"
			/>
		</div>
	</FilterSection>
</template>

<script setup lang="ts">
import KernBlockButton from '@/components/kern/KernBlockButton.ce.vue'
import KernBlockButtonCheckbox from '@/components/kern/KernBlockButtonCheckbox.ce.vue'
import KernCheckbox from '@/components/kern/KernCheckbox.ce.vue'
import { useCoreStore } from '@/core/stores'

import { useFilterStore } from '../store'
import {
	PluginId,
	type Category,
	type CategoryValue,
	type FilterState,
} from '../types'
import FilterSection from './FilterSection.ce.vue'

const coreStore = useCoreStore()
const filterStore = useFilterStore()

function expandValue(value: Category['knownValues'][number]) {
	return typeof value === 'string' ? { key: value, values: [value] } : value
}

function flattenValue(value: Category['knownValues'][number]) {
	return expandValue(value).key
}

function createMissingObjects(targetProperty: string) {
	// The state is created automatically and this component is only used when a layer is selected.
	const layerState = filterStore.selectedLayerState as FilterState
	layerState.knownValues ??= {}
	return (layerState.knownValues[targetProperty] ??= Object.fromEntries(
		filterStore.selectedLayerConfiguration.categories
			?.find((category) => category.targetProperty === targetProperty)
			?.knownValues.map((value) => [flattenValue(value), true]) ?? []
	))
}

function getStatus(targetProperty: string, { values }: CategoryValue) {
	return Object.entries(
		filterStore.selectedLayerState?.knownValues?.[targetProperty] ?? {}
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
</script>
