<template>
	<PolarCard>
		<FilterLayerChooser
			v-if="filterStore.layers.length > 1"
			v-model="filterStore.selectedLayerId"
		/>
		<h2 v-else class="kern-heading-medium">
			{{ filterStore.selectedLayer?.layerConfiguration?.name }}
		</h2>
		<FilterCategory v-if="filterStore.selectedLayerId" />
		<FilterTime v-if="filterStore.selectedLayerHasTimeFilter" />
	</PolarCard>
</template>

<script setup lang="ts">
import PolarCard from '@/components/PolarCard.ce.vue'

import { useFilterStore } from '../store'
import FilterCategory from './FilterCategory.ce.vue'
import FilterLayerChooser from './FilterLayerChooser.ce.vue'
import FilterTime from './FilterTime.ce.vue'

const filterStore = useFilterStore()
</script>

<style scoped>
:deep(.polar-filter-section) {
	width: 100%;

	h3 {
		padding-left: 0.15em;
	}

	.polar-filter-category-values {
		display: flex;
		flex-direction: column;
		gap: var(--kern-metric-space-x-small);
	}
}
</style>
