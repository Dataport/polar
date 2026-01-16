<template>
	<PolarCard class="polar-filter-card">
		<FilterLayerChooser
			v-if="Object.keys(filterStore.configuration.layers).length > 1"
			v-model="selectedLayer"
		/>
		<FilterCategory v-if="selectedLayer" :layer="selectedLayer" />
		<FilterTime v-if="selectedLayer" :layer="selectedLayer" />
	</PolarCard>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import PolarCard from '@/components/PolarCard.ce.vue'

import { useFilterStore } from '../store'
import FilterCategory from './FilterCategory.ce.vue'
import FilterLayerChooser from './FilterLayerChooser.ce.vue'
import FilterTime from './FilterTime.ce.vue'

const filterStore = useFilterStore()
const selectedLayer = ref('')

watch(
	() => filterStore.configuration.layers,
	(layers) => {
		if (selectedLayer.value.length === 0) {
			selectedLayer.value = Object.keys(layers)[0] || ''
		}
	},
	{ immediate: true, deep: true }
)
</script>

<style scoped>
.polar-filter-card {
	pointer-events: all;
	padding-bottom: 3em;
}

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
