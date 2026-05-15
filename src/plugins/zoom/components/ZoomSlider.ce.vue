<template>
	<PolarTooltip
		:hint="$t(($) => $.slider, { ns: PluginId })"
		:tooltip-position="tooltipPosition"
	>
		<input
			v-model="zoomLevel"
			:class="{
				'polar-plugin-zoom-slider': true,
				'polar-plugin-zoom-slider-vertical': !renderHorizontal,
			}"
			type="range"
			:min="minimumZoomLevel"
			:max="maximumZoomLevel"
			:aria-label="$t(($) => $.slider, { ns: PluginId })"
		/>
	</PolarTooltip>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import PolarTooltip from '@/components/PolarTooltip.ce.vue'

import { useZoomStore } from '../store'
import { PluginId } from '../types'

const {
	minimumZoomLevel,
	maximumZoomLevel,
	zoomLevel,
	renderHorizontal,
	tooltipPosition,
} = storeToRefs(useZoomStore())
</script>

<style scoped>
.polar-plugin-zoom-slider {
	width: var(--kern-metric-dimension-5x-large);

	&.polar-plugin-zoom-slider-vertical {
		width: unset;
		height: var(--kern-metric-dimension-5x-large);
		writing-mode: vertical-lr;
		direction: rtl;
	}
}
</style>
