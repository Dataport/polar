<template>
	<input
		v-model="zoomStore.zoomLevel"
		type="range"
		:min="zoomStore.minimumZoomLevel"
		:max="zoomStore.maximumZoomLevel"
		:step="1"
		:aria-label="$t(($) => $.slider, { ns: PluginId })"
		:class="{ vertical: zoomStore.renderType === 'vertical' }"
	/>
</template>

<script setup lang="ts">
import { useZoomStore } from '../store'
import { PluginId } from '../types'

const zoomStore = useZoomStore()
</script>

<style scoped>
input {
	margin: var(--kern-metric-space-small);
	width: 12em;

	&.vertical {
		margin-left: var(--kern-metric-space-large);
		transform: translateX(-50%) translateY(-50%) rotate(-90deg) translateX(-50%);
	}
}
</style>
