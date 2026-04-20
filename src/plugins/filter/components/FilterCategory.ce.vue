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
				@click="filterStore.selectOrDeselectAllFromCategory(category)"
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
					filterStore.getCategoryStatus(
						category.targetProperty,
						expandValue(categoryValue)
					)
				"
				@update:model-value="
					filterStore.setCategoryStatus(
						category.targetProperty,
						expandValue(categoryValue),
						$event
					)
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
import { PluginId } from '../types'
import { expandValue, flattenValue } from '../utils/flattenAndExpandValue'
import FilterSection from './FilterSection.ce.vue'

const coreStore = useCoreStore()
const filterStore = useFilterStore()
</script>
