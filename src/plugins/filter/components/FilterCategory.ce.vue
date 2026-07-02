<template>
	<FilterSection
		v-for="(category, idx) of filterStore.categories"
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
		<PolarInputGroup
			legend-sr-only
			:legend="
				$t(
					($) =>
						$['layer'][filterStore.selectedLayerId]['category'][
							category.targetProperty
						]['title'],
					{ ns: PluginId, defaultValue: category.targetProperty }
				)
			"
		>
			<KernButton
				v-if="category.selectAll"
				class="kern-btn--block kern-btn--tertiary"
				icon="kern-icon--deselect"
				@click="filterStore.selectOrDeselectAllFromCategory(category)"
			>
				{{ $t(($) => $.category.deselectAll, { ns: PluginId }) }}
			</KernButton>
			<PolarInput
				v-for="categoryValue of category.knownValues"
				:key="flattenValue(categoryValue)"
				v-model="category.selection"
				type="checkbox"
				:name="category.targetProperty"
				:value="flattenValue(categoryValue)"
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
			</PolarInput>
		</PolarInputGroup>
	</FilterSection>
</template>

<script setup lang="ts">
import KernButton from '@/components/kern/KernButton.ce.vue'
import PolarInput from '@/components/PolarInput.ce.vue'
import PolarInputGroup from '@/components/PolarInputGroup.ce.vue'

import { useFilterStore } from '../store'
import { PluginId } from '../types'
import { flattenValue } from '../utils/flattenAndExpandValue'
import FilterSection from './FilterSection.ce.vue'

const filterStore = useFilterStore()
</script>

<style scoped>
.kern-btn--tertiary {
	background-color: #edf1fa;
	justify-content: left;
	margin-bottom: var(--kern-metric-space-small);
}
</style>
