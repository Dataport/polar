<template>
	<PolarIconButton
		class="polar-plugin-exporter-standard"
		hint="Export"
		icon="kern-icon-fill--image"
		tooltip-position="left"
		@click="() => exportAs('png')"
	/>
</template>

<script setup lang="ts">
import PolarIconButton from '@/components/PolarIconButton.ce.vue'

import { useExportStore } from '../store'

const { exportAs } = useExportStore()
</script>
<style scoped>
.polar-icon-button.polar-plugin-exporter-standard {
	box-shadow: none;
}
</style>
