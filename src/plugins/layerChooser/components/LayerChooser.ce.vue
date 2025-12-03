<template>
	<LayerSelection v-if="displaySelection" />
	<LayerLegend v-else-if="displayLegend" />
	<LayerOptions v-else />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLayerChooserStore } from '../store'
import LayerSelection from './LayerSelection.ce.vue'
import LayerLegend from './LayerLegend.ce.vue'
import LayerOptions from './LayerOptions.ce.vue'

const layerChooserStore = useLayerChooserStore()
const displayLegend = computed(
	() => layerChooserStore.openedLegendId.length !== 0
)
const displaySelection = computed(
	() => layerChooserStore.openedOptionsId.length === 0 && !displayLegend.value
)
</script>
