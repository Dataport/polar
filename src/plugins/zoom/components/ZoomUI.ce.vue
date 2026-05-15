<template>
	<div
		v-if="zoomUiVisible"
		class="polar-plugin-zoom-ui"
		:class="{ 'polar-plugin-zoom-ui-horizontal': renderHorizontal }"
	>
		<ZoomButtons />
		<ZoomSlider v-if="zoomSliderVisible" />
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useZoomStore } from '../store'
import ZoomButtons from './ZoomButtons.ce.vue'
import ZoomSlider from './ZoomSlider.ce.vue'

const { zoomUiVisible, zoomSliderVisible, renderHorizontal } =
	storeToRefs(useZoomStore())
</script>

<style scoped>
.polar-plugin-zoom-ui {
	display: flex;
	flex-direction: column;
	gap: var(--kern-metric-space-small);

	&.polar-plugin-zoom-ui-horizontal {
		flex-direction: row;
	}
}
</style>
