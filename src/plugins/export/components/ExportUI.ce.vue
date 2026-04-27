<template>
	<div ref="wrapper" class="polar-plugin-export-wrapper">
		<PolarIconButton
			v-if="filteredExportOptions.length >= 1"
			class="polar-plugin-export-primary"
			hint="Export"
			icon="kern-icon-fill--image"
			:tooltip-position="tooltipPosition"
			@click="singleExport ? exportAs(singleExport) : toggleButtons()"
		/>
		<div
			v-if="visible && !singleExport"
			class="polar-plugin-export-fanout"
			:class="`polar-plugin-export-fanout-${tooltipPosition}`"
		>
			<PolarIconButton
				v-for="format in filteredExportOptions"
				:key="format"
				class="polar-plugin-export-secondary"
				:hint="`Export ${format.toUpperCase()}`"
				:icon="icon(format)"
				:tooltip-position="tooltipPosition"
				@click="() => exportAs(format)"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import PolarIconButton from '@/components/PolarIconButton.ce.vue'
import { useCoreStore } from '@/core/stores'

import { useExportStore } from '../store'

const { layout } = storeToRefs(useCoreStore())
const {
	exportAs,
	filteredExportOptions,
	singleExport,
	renderType,
	configuration,
} = useExportStore()
const visible = ref(false)
const toggleButtons = () => {
	visible.value = !visible.value
}
const tooltipPosition = computed(() =>
	renderType === 'iconMenu'
		? undefined
		: layout.value === 'standard' || configuration.layoutTag?.includes('RIGHT')
			? 'left'
			: 'right'
)

const icon = (format: string) => {
	switch (format) {
		case 'png':
		case 'jpg':
		case 'jpeg':
			return 'kern-icon-fill--imagesmode'
		case 'pdf':
			return 'kern-icon-fill--picture-as-pdf'
		default:
			return 'kern-icon-fill--image'
	}
}
</script>
<style scoped>
.polar-plugin-export-wrapper {
	position: relative;
}
.polar-icon-button.polar-plugin-export-primary,
.polar-icon-button.polar-plugin-export-secondary {
	box-shadow: none;
}
.polar-icon-button.polar-plugin-export-secondary {
	opacity: 0.75;
}
.polar-icon-button.polar-plugin-export-secondary:hover {
	opacity: 1;
}
.polar-plugin-export-fanout {
	position: absolute;
	top: 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: var(--kern-metric-space-x-small);
}
.polar-plugin-export-fanout-left {
	right: calc(100% + var(--kern-metric-space-x-small));
	flex-direction: row-reverse;
}
.polar-plugin-export-fanout-right {
	left: calc(100% + var(--kern-metric-space-x-small));
}
</style>
