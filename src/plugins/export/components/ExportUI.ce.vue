<template>
	<div class="polar-plugin-export">
		<PolarIconButton
			:hint="
				singleExport
					? $t(($) => $.button.hint, {
							ns: 'export',
							format: singleExport?.toUpperCase(),
						})
					: $t(($) => $.button.tooltip, { ns: 'export' })
			"
			:icon="singleExport ? icon(singleExport) : 'kern-icon-fill--photo-camera'"
			:tooltip-position="tooltipPosition"
			@click="singleExport ? exportAs(singleExport) : toggleButtons()"
		/>
		<div
			v-if="visible && !singleExport"
			class="polar-plugin-export-formats"
			:class="`polar-plugin-export-formats-${tooltipPosition}`"
		>
			<PolarIconButton
				v-for="format in availableFormats"
				:key="format"
				:hint="
					$t(($) => $.button.hint, {
						ns: 'export',
						format: format.toUpperCase(),
					})
				"
				:icon="icon(format)"
				:tooltip-position="tooltipPosition"
				@click="exportAs(format)"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import PolarIconButton from '@/components/PolarIconButton.ce.vue'

import type { ExportFormat } from '../types'

import { useExportStore } from '../store'

const exportStore = useExportStore()

const { availableFormats, layoutTag } = storeToRefs(exportStore)
const { exportAs } = exportStore

const visible = ref(false)
const toggleButtons = () => (visible.value = !visible.value)

const tooltipPosition = computed(() =>
	layoutTag.value?.includes('RIGHT') ? 'left' : 'right'
)

const singleExport = computed(() =>
	availableFormats.value.length === 1 ? availableFormats.value[0] : null
)

const icon = (format: ExportFormat) => {
	switch (format) {
		case 'png':
			return 'kern-icon-fill--file-png'
		case 'pdf':
			return 'kern-icon-fill--picture-as-pdf'
		case 'jpg':
		case 'jpeg':
		default:
			return 'kern-icon-fill--imagesmode'
	}
}
</script>

<style scoped>
.polar-plugin-export {
	position: relative;
	margin: var(--kern-metric-space-2x-small);

	.polar-plugin-export-formats {
		position: absolute;
		top: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--kern-metric-space-x-small);

		&.polar-plugin-export-formats-left {
			right: calc(100% + var(--kern-metric-space-x-small));
			flex-direction: row-reverse;
		}

		&.polar-plugin-export-formats-right {
			left: calc(100% + var(--kern-metric-space-x-small));
		}
	}
}
</style>
