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
			<KernButton
				v-if="category.selectAll"
				class="kern-btn--block kern-btn--tertiary"
				icon="kern-icon--deselect"
				@click="filterStore.selectOrDeselectAllFromCategory(category)"
			>
				{{ $t(($) => $.category.deselectAll, { ns: PluginId }) }}
			</KernButton>
			<component
				:is="
					coreStore.layout === 'standard'
						? KernBlockButtonCheckbox
						: KernCheckbox
				"
				v-for="categoryValue of category.knownValues"
				:key="flattenValue(categoryValue)"
				:icon="typeof categoryValue !== 'string' && categoryValue.icon"
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
			>
				{{
					$t(
						($) =>
							$['layer'][filterStore.selectedLayerId]['category'][
								category.targetProperty
							]['knownValue'][flattenValue(categoryValue)],
						{ ns: PluginId, defaultValue: flattenValue(categoryValue) }
					)
				}}
			</component>
		</div>
	</FilterSection>
</template>

<script setup lang="ts">
import KernBlockButtonCheckbox from '@/components/kern/KernBlockButtonCheckbox.ce.vue'
import KernButton from '@/components/kern/KernButton.ce.vue'
import KernCheckbox from '@/components/kern/KernCheckbox.ce.vue'
import { useCoreStore } from '@/core/stores'

import { useFilterStore } from '../store'
import { PluginId } from '../types'
import { expandValue, flattenValue } from '../utils/flattenAndExpandValue'
import FilterSection from './FilterSection.ce.vue'

const coreStore = useCoreStore()
const filterStore = useFilterStore()
</script>

<style scoped>
.kern-btn--tertiary {
	background-color: #edf1fa;
	justify-content: left;
	margin-bottom: var(--kern-metric-space-small);
}
</style>
