<template>
	<section class="polar-filter-section">
		<h3 class="kern-heading-small">
			{{ $t(($) => $.time.header, { ns: PluginId }) }}
		</h3>
		<div class="polar-filter-category-values">
			<KernBlockButtonRadioGroup
				v-model="filterStore.timeModel"
				:items="filterStore.timeItems"
			/>
		</div>
		<KernDateRangePicker
			v-if="filterStore.timeModel === 'custom'"
			v-model:start="filterStore.timeStart"
			v-model:end="filterStore.timeEnd"
			v-bind="filterStore.timeConstraints"
		/>
	</section>
</template>

<script setup lang="ts">
import KernBlockButtonRadioGroup from '@/components/kern/KernBlockButtonRadioGroup.ce.vue'
import KernDateRangePicker from '@/components/kern/KernDateRangePicker.ce.vue'

import { useFilterStore } from '../store'
import { PluginId } from '../types'

const filterStore = useFilterStore()
</script>
