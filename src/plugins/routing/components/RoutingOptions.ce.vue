<template>
	<PolarToggleButton
		v-model="selectedTravelMode"
		:label="$t(($) => $.label.travelMode, { ns: PluginId })"
		:options="travelModes"
	/>
	<!-- TODO: displayPreferences -->
	<!-- TODO: displayRouteTypesToAvoid -->
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import PolarToggleButton from '@/components/PolarToggleButton.ce.vue'

import { useRoutingStore } from '../store.ts'
import { PluginId } from '../types'

const { selectedTravelMode, travelModes } = storeToRefs(useRoutingStore())
</script>
