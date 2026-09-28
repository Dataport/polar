<template>
	<PolarIconButton
		:hint="$t(($) => $.button.tooltip, { ns: PluginId })"
		:icon="icon"
		:tooltip-position="geoLocationStore.spaceDirection"
		:disabled="state === 'DISABLED'"
		@click="geoLocationStore.locate"
	/>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import PolarIconButton from '@/components/PolarIconButton.ce.vue'

import { useGeoLocationStore } from '../store'
import { PluginId } from '../types'

const geoLocationStore = useGeoLocationStore()
const { state } = storeToRefs(geoLocationStore)

const icon = computed(() => {
	if (state.value === 'LOCATED') {
		return 'kern-icon-fill--near-me'
	} else if (state.value === 'LOCATABLE') {
		return 'kern-icon--near-me'
	}
	return 'kern-icon--near-me-disabled'
})
</script>
