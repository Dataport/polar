<template>
	<LayerSelection v-if="displaySelection" />
	<LayerOptions v-else />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLayerChooserStore } from '../store'
import LayerSelection from './LayerSelection.ce.vue'
import LayerOptions from './LayerOptions.ce.vue'

const displaySelection = computed(
	() => useLayerChooserStore().openedOptionsId.length === 0
)
</script>
