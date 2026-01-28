<template>
	<section
		v-for="category of layerConfiguration.categories"
		:key="category.targetProperty"
		class="polar-filter-section"
	>
		<h3 class="kern-heading-small">
			{{
				$t(
					($) =>
						$['layer'][props.layer]['category'][category.targetProperty][
							'title'
						],
					{ ns: PluginId }
				)
			}}
		</h3>
		<div class="polar-filter-category-values">
			<KernBlockButton
				v-if="category.selectAll"
				icon="kern-icon--deselect"
				:label="$t(($) => $.category.deselectAll, { ns: 'filter' })"
				@click="selectOrDeselectAll(category)"
			/>
			<KernBlockButtonCheckbox
				v-for="categoryValue of category.knownValues"
				:key="flattenValue(categoryValue)"
				:icon="typeof categoryValue !== 'string' && categoryValue.icon"
				:label="
					$t(
						($) =>
							$['layer'][props.layer]['category'][category.targetProperty][
								'knownValue'
							][flattenValue(categoryValue)],
						{ ns: PluginId }
					)
				"
				:model-value="
					filterStore.state[props.layer]?.knownValues?.[
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
import { computed } from 'vue'

import KernBlockButton from '@/components/kern/KernBlockButton.ce.vue'
import KernBlockButtonCheckbox from '@/components/kern/KernBlockButtonCheckbox.ce.vue'

import { useFilterStore } from '../store'
import { PluginId, type Category, type FilterConfiguration } from '../types'

const props = defineProps<{
	layer: string
}>()

const filterStore = useFilterStore()
const layerConfiguration = computed(
	() => filterStore.configuration.layers[props.layer] as FilterConfiguration
)

function flattenValue(value: string | { value: string }) {
	return typeof value === 'string' ? value : value.value
}

function createMissingObjects(targetProperty: string) {
	const layerState = (filterStore.state[props.layer] ??= {})
	layerState.knownValues ??= {}
	return (layerState.knownValues[targetProperty] ??= Object.fromEntries(
		layerConfiguration.value.categories
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
