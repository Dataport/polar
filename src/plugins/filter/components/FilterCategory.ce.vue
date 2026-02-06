<template>
	<section
		v-for="(category, idx) of filterStore.selectedLayerConfiguration.categories"
		:key="idx"
		class="polar-filter-section"
	>
		<h3 class="kern-heading-small">
			{{
				$t(
					($) =>
						$['layer'][filterStore.selectedLayerId]['category'][
							category.targetProperty
						]['title'],
					{ ns: PluginId, defaultValue: category.targetProperty }
				)
			}}
		</h3>
		<div class="polar-filter-category-values">
			<KernBlockButton
				v-if="category.selectAll"
				icon="kern-icon--deselect"
				:label="$t(($) => $.category.deselectAll, { ns: PluginId })"
				@click="selectOrDeselectAll(category)"
			/>
			<KernBlockButtonCheckbox
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
					filterStore.selectedLayerState?.knownValues?.[
						category.targetProperty
					]?.[flattenValue(categoryValue)] ?? true
				"
				@update:model-value="
					setStatus(
						category.targetProperty,
						flattenValue(categoryValue),
						$event
					)
				"
			/>
		</div>
	</section>
</template>

<script setup lang="ts">
import KernBlockButton from '@/components/kern/KernBlockButton.ce.vue'
import KernBlockButtonCheckbox from '@/components/kern/KernBlockButtonCheckbox.ce.vue'

import { useFilterStore } from '../store'
import { PluginId, type Category, type FilterState } from '../types'

const filterStore = useFilterStore()

function flattenValue(value: string | { value: string }) {
	return typeof value === 'string' ? value : value.value
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

function setStatus(targetProperty: string, value: string, newValue: boolean) {
	createMissingObjects(targetProperty)[value] = newValue
}

function selectOrDeselectAll(category: Category) {
	const valueState = createMissingObjects(category.targetProperty)
	const newStatus =
		Object.values(valueState).filter((selected) => selected).length !==
		category.knownValues.length
	category.knownValues.forEach((value) => {
		valueState[flattenValue(value)] = newStatus
	})
}
</script>
