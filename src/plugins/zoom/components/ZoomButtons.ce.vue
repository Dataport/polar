<template>
	<PolarIconButton
		:hint="$t(($) => $.zoomIn, { ns: PluginId })"
		:icon="zoomInIcon"
		:tooltip-position="tooltipPosition"
		:disabled="maximumZoomLevelActive"
		@click="zoomLevel++"
	/>
	<PolarIconButton
		:hint="$t(($) => $.zoomOut, { ns: PluginId })"
		:icon="zoomOutIcon"
		:tooltip-position="tooltipPosition"
		:disabled="minimumZoomLevelActive"
		@click="zoomLevel--"
	/>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import PolarIconButton from '@/components/PolarIconButton.ce.vue'

import { useZoomStore } from '../store'
import { PluginId } from '../types'

const {
	tooltipPosition,
	minimumZoomLevelActive,
	maximumZoomLevelActive,
	zoomLevel,
	zoomInIcon,
	zoomOutIcon,
} = storeToRefs(useZoomStore())
</script>
