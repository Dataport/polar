<template>
	<PolarCard>
		<FilterLayerChooser
			v-if="filterStore.layers.length > 1"
			v-model="filterStore.selectedLayerId"
		/>
		<h2 v-else class="kern-heading-medium">
			{{ filterStore.selectedLayer?.layerConfiguration?.name }}
		</h2>
		<component
			:is="coreStore.layout === 'nineRegions' ? 'div' : PolarTemplate"
			class="kern-accordion-group"
		>
			<FilterCategory v-if="filterStore.selectedLayerId" />
			<FilterTime v-if="filterStore.selectedLayerHasTimeFilter" />
		</component>
	</PolarCard>
</template>

<script setup lang="ts">
import PolarCard from '@/components/PolarCard.ce.vue'
import PolarTemplate from '@/components/PolarTemplate.ce.vue'
import { useCoreStore } from '@/core/stores'

import { useFilterStore } from '../store'
import FilterCategory from './FilterCategory.ce.vue'
import FilterLayerChooser from './FilterLayerChooser.ce.vue'
import FilterTime from './FilterTime.ce.vue'

const coreStore = useCoreStore()
const filterStore = useFilterStore()
</script>

<style scoped>
:deep(.polar-filter-category-values) {
	display: flex;
	flex-direction: column;
	gap: var(--kern-metric-space-x-small);
}

:deep(.kern-accordion-group .polar-filter-category-values) {
	margin-top: var(--kern-metric-space-default);
}

.kern-accordion-group {
	width: 100%;
}
</style>
