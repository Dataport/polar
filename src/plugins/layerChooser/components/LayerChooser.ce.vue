<template>
	<PolarCard>
		<LayerSelection v-if="displaySelection" />
		<LayerOptions v-else />
	</PolarCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LayerSelection from './LayerSelection.ce.vue'
import LayerOptions from './LayerOptions.ce.vue'
import PolarCard from '@/components/PolarCard.ce.vue'
import { useLayerChooserStore } from '@/plugins/layerChooser/store.ts'

const displaySelection = computed(
	() => useLayerChooserStore().openedOptions.length === 0
)
</script>
