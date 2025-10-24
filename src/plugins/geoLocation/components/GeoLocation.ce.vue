<template>
	<PolarIconButton
		v-if="state !== 'DISABLED'"
		:hint="$t(($) => $.button.tooltip, { ns: PluginId })"
		:icon="icon"
		:tooltip-position="tooltipPosition"
		@click="geoLocationStore.locate"
	/>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useGeoLocationStore } from '../store'
import { PluginId } from '../types'
import PolarIconButton from '@/components/PolarIconButton.ce.vue'
import { useCoreStore } from '@/core/stores/export'

const { layout } = storeToRefs(useCoreStore())
const geoLocationStore = useGeoLocationStore()
const { state } = storeToRefs(geoLocationStore)
// TODO: Place plugin in IconMenu; make it work if NineRegions if it is independent

const icon = computed(() =>
	state.value === 'LOCATED' ? 'kern-icon-fill--near-me' : 'kern-icon--near-me'
)
const tooltipPosition = computed(() =>
	layout.value === 'standard' ||
	(geoLocationStore.configuration.renderType === 'independent' &&
		geoLocationStore.configuration.layoutTag?.includes('RIGHT'))
		? 'left'
		: 'right'
)
</script>

<style scoped>
.polar-plugin-geoLocation-standard {
	position: absolute;
	right: 0;
	top: 4em;
	margin: 8px;
	pointer-events: all;
}
</style>
