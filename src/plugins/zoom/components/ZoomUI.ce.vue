<template>
	<template v-if="zoomStore.renderType === 'iconMenu'">
		<ZoomButtons v-if="zoomStore.zoomButtonsVisible" />
		<ZoomSlider v-if="zoomStore.zoomSliderVisible" />
	</template>
	<div
		v-else
		:class="{
			'polar-plugin-zoom-ui': true,
			vertical: zoomStore.renderType === 'vertical',
		}"
	>
		<ZoomButtons v-if="zoomStore.zoomButtonsVisible" />
		<ZoomSlider v-if="zoomStore.zoomSliderVisible" />
	</div>
</template>

<script setup lang="ts">
import { useZoomStore } from '../store'
import ZoomButtons from './ZoomButtons.ce.vue'
import ZoomSlider from './ZoomSlider.ce.vue'

const zoomStore = useZoomStore()
</script>

<style scoped>
.polar-plugin-zoom-ui {
	display: flex;
	flex-direction: row;

	&.vertical {
		flex-direction: column;
	}
}
</style>
