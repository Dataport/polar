<template>
	<PolarToggleButton
		v-model="selectedTravelMode"
		:label="$t(($) => $.label.travelMode, { ns: PluginId })"
		:options="travelModes"
	/>
	<PolarSelect
		v-if="displayPreferences"
		:label="$t(($) => $.label.preference, { ns: PluginId })"
		:aria-label="$t(($) => $.label.preference, { ns: PluginId })"
		:options="selectablePreferences"
		:value="selectedPreference"
		@update:value="selectedPreference = $event as string"
	/>
	<!-- TODO: displayRouteTypesToAvoid -->
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import PolarSelect from '@/components/PolarSelect.ce.vue'
import PolarToggleButton from '@/components/PolarToggleButton.ce.vue'

import { useRoutingStore } from '../store.ts'
import { PluginId } from '../types'

const {
	displayPreferences,
	selectablePreferences,
	selectedPreference,
	selectedTravelMode,
	travelModes,
} = storeToRefs(useRoutingStore())
</script>
