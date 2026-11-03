<template>
	<LayerSelection v-if="displaySelection" />
	<LayerLegend v-else-if="displayLegend" />
	<LayerOptions v-else />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useLayerChooserStore } from '../store'
import LayerLegend from './LayerLegend.vue'
import LayerOptions from './LayerOptions.vue'
import LayerSelection from './LayerSelection.vue'

const layerChooserStore = useLayerChooserStore()
const displayLegend = computed(
	() => layerChooserStore.openedLegendId.length !== 0
)
const displaySelection = computed(
	() => layerChooserStore.openedOptionsId.length === 0 && !displayLegend.value
)
</script>
