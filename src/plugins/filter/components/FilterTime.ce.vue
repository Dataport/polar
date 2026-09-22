<template>
	<FilterSection :title="$t(($) => $.time.header, { ns: PluginId })">
		<PolarInputGroup
			legend-sr-only
			:legend="$t(($) => $.time.header, { ns: PluginId })"
		>
			<PolarInput
				v-for="item of filterStore.timeItems"
				:key="item.value"
				v-model="filterStore.timeModel"
				type="radio"
				name="timeFilter"
				:value="item.value"
			>
				{{ item.label }}
			</PolarInput>
		</PolarInputGroup>
		<div
			v-if="filterStore.timeModel === 'custom'"
			ref="dateRange"
			class="polar-filter-time-range"
		>
			<KernDateRangePicker
				v-model:start="filterStore.timeStart"
				v-model:end="filterStore.timeEnd"
				v-bind="filterStore.timeConstraints"
			/>
		</div>
	</FilterSection>
</template>

<script setup lang="ts">
import { nextTick, useTemplateRef, watch } from 'vue'

import KernDateRangePicker from '@/components/kern/KernDateRangePicker.ce.vue'
import PolarInput from '@/components/PolarInput.ce.vue'
import PolarInputGroup from '@/components/PolarInputGroup.ce.vue'

import { useFilterStore } from '../store'
import { PluginId } from '../types'
import FilterSection from './FilterSection.ce.vue'

const filterStore = useFilterStore()

const dateRange = useTemplateRef<HTMLElement>('dateRange')

watch(
	() => filterStore.timeModel,
	async (value) => {
		if (value === 'custom') {
			await nextTick()
			dateRange.value?.scrollIntoView({ behavior: 'smooth' })
		}
	}
)
</script>

<style scoped>
.polar-filter-time-range {
	margin-top: var(--kern-metric-space-default);
}
</style>
