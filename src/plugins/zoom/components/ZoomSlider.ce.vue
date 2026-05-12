<template>
	<!-- TODO: needs tooltip -->
	<input
		v-model="zoomStore.zoomLevel"
		type="range"
		:min="zoomStore.minimumZoomLevel"
		:max="zoomStore.maximumZoomLevel"
		:step="1"
		:aria-label="$t(($) => $.slider, { ns: PluginId })"
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
	margin-left: var(--kern-metric-space-large);
	width: 12em;
	transform: translateX(-50%) translateY(-50%) rotate(-90deg) translateX(-50%);
}
</style>
