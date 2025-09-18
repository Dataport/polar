<template>
	<PolarIconButton
		v-if="state !== 'DISABLED'"
		:action="action"
		:class="layout === 'standard' ? 'polar-plugin-geoLocation-standard' : ''"
		hint="button.tooltip"
		:hint-namespace="PluginId"
		:icon="icon"
		:tooltip-position="tooltipPosition"
	/>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGeoLocationStore } from '../store'
import { PluginId } from '../types'
import { useCoreStore } from '@/core/stores/export.ts'
import PolarIconButton from '@/components/PolarIconButton.ce.vue'

const { layout } = storeToRefs(useCoreStore())
const { action, state } = storeToRefs(useGeoLocationStore())

// TODO: this can't be a fixed value, but depends on the environment
const tooltipPosition = 'left'

const icon = computed(() =>
	state.value === 'LOCATED' ? 'kern-icon-fill--near-me' : 'kern-icon--near-me'
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
