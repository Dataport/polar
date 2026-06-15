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
import { t } from 'i18next'
import { storeToRefs } from 'pinia'
import { computed, type Ref } from 'vue'

import type { Icon } from '@/core'

import PolarToggleButton from '@/components/PolarToggleButton.ce.vue'
import { useT } from '@/core/composables/useT.ts'

import { useRoutingStore } from '../store.ts'
import { PluginId } from '../types'

interface TravelMode {
	icon: Icon
	label: Ref<string>
	value: string
}

const { selectedTravelMode } = storeToRefs(useRoutingStore())

const travelModes = computed<TravelMode[]>(() => [
	{
		value: 'driving-car',
		label: useT(() => t(($) => $.travelMode.car, { ns: PluginId })),
		icon: 'kern-icon--directions-car',
	},
	{
		value: 'driving-hgv',
		label: useT(() => t(($) => $.travelMode.hgv, { ns: PluginId })),
		icon: 'kern-icon--local-shipping',
	},
	{
		value: 'cycling-regular',
		label: useT(() => t(($) => $.travelMode.bike, { ns: PluginId })),
		icon: 'kern-icon--directions-bike',
	},
	{
		value: 'foot-walking',
		label: useT(() => t(($) => $.travelMode.walking, { ns: PluginId })),
		icon: 'kern-icon--directions-walk',
	},
	{
		value: 'wheelchair',
		label: useT(() => t(($) => $.travelMode.wheelchair, { ns: PluginId })),
		icon: 'kern-icon--accessible',
	},
])
</script>
