<template>
	<PolarIconButton
		:hint="$t(($) => $.zoomIn, { ns: PluginId })"
		:icon="zoomStore.zoomInIcon"
		tooltip-position="left"
		:disabled="zoomStore.maximumZoomLevelActive"
		class="polar-plugin-zoom-icon-button"
		@click="zoomStore.zoomLevel++"
	/>
	<PolarIconButton
		:hint="$t(($) => $.zoomOut, { ns: PluginId })"
		:icon="zoomStore.zoomOutIcon"
		tooltip-position="left"
		:disabled="zoomStore.minimumZoomLevelActive"
		class="polar-plugin-zoom-icon-button"
		@click="zoomStore.zoomLevel--"
	/>
</template>

<script setup lang="ts">
import PolarIconButton from '@/components/PolarIconButton.ce.vue'

import { useZoomStore } from '../store'
import { PluginId } from '../types'

const zoomStore = useZoomStore()
</script>

<style scoped>
.polar-plugin-zoom-icon-button {
	margin: var(--kern-metric-space-small);

	&:nth-child(n + 2) {
		margin-top: 0;
	}
}

:global(.polar-plugin-icon-menu-list-item button) {
	margin: 0;
}
</style>
