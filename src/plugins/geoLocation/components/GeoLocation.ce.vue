<template>
	<PolarIconButton
		:class="
			layout === 'nineRegions' ? 'polar-plugin-geoLocation-nineRegions' : ''
		"
		:hint="$t(($) => $.button.tooltip, { ns: PluginId })"
		:icon="icon"
		:tooltip-position="tooltipPosition"
		:disabled="state === 'DISABLED'"
		@click="geoLocationStore.locate"
	/>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'

import PolarIconButton from '@/components/PolarIconButton.ce.vue'
import { useCoreStore } from '@/core/stores'

import { useGeoLocationStore } from '../store'
import { PluginId } from '../types'

const { layout, center, zoom } = storeToRefs(useCoreStore())
const geoLocationStore = useGeoLocationStore()
const { state } = storeToRefs(geoLocationStore)
const { position, mapHasBeenMovedByUser } = storeToRefs(geoLocationStore)

let lastZoom = zoom.value

const icon = computed(() => {
	if (state.value === 'LOCATED') {
		return 'kern-icon-fill--near-me'
	} else if (state.value === 'LOCATABLE') {
		return 'kern-icon--near-me'
	}
	return 'kern-icon--near-me-disabled'
})
const tooltipPosition = computed(() =>
	geoLocationStore.configuration.renderType === 'iconMenu'
		? undefined
		: layout.value === 'standard' ||
			  geoLocationStore.configuration.layoutTag?.includes('RIGHT')
			? 'left'
			: 'right'
)

watch(center, () => {
	const isZooming = zoom.value !== lastZoom
	lastZoom = zoom.value

	if (!isZooming && position.value !== center.value) {
		mapHasBeenMovedByUser.value = true
	}
})
</script>

<style scoped>
.polar-plugin-geoLocation-nineRegions {
	margin: var(--kern-metric-space-small);
}
</style>
