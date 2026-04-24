<template>
	<PolarIconButton
		v-if="filteredExportOptions.length > 1"
		class="polar-plugin-export-standard"
		hint="Export"
		icon="kern-icon-fill--image"
		tooltip-position="left"
		@click="singleExport ? exportAs(singleExport) : toggleButtons()"
	/>
	<div v-if="visible">
		<PolarIconButton
			v-for="format in filteredExportOptions"
			:key="format"
			class="polar-plugin-export-standard"
			:hint="`Export ${format.toUpperCase()}`"
			icon="kern-icon-fill--image"
			tooltip-position="left"
			@click="() => exportAs(format)"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import PolarIconButton from '@/components/PolarIconButton.ce.vue'

import { useExportStore } from '../store'

const { exportAs, filteredExportOptions, singleExport } = useExportStore()
const visible = ref(false)
const toggleButtons = () => {
	visible.value = !visible.value
}
</script>
<style scoped>
.polar-icon-button.polar-plugin-export-standard {
	box-shadow: none;
}
</style>
