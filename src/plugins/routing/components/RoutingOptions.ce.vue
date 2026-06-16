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
	<PolarInputGroup
		v-if="displayRouteTypesToAvoid"
		:legend="$t(($) => $.label.avoid, { ns: PluginId })"
	>
		<PolarInput
			v-for="type in selectableRouteTypesToAvoid"
			:key="type"
			v-model="selectedRouteTypesToAvoid"
			id-suffix="polar-routing-types-to-avoid"
			type="checkbox"
			name="polar-routing-types-to-avoid"
			:value="type"
		>
			{{ $t(($) => $.avoid[type], { ns: PluginId }) }}
		</PolarInput>
	</PolarInputGroup>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import PolarInput from '@/components/PolarInput.ce.vue'
import PolarInputGroup from '@/components/PolarInputGroup.ce.vue'
import PolarSelect from '@/components/PolarSelect.ce.vue'
import PolarToggleButton from '@/components/PolarToggleButton.ce.vue'

import { useRoutingStore } from '../store.ts'
import { PluginId } from '../types'

const {
	displayPreferences,
	displayRouteTypesToAvoid,
	selectablePreferences,
	selectableRouteTypesToAvoid,
	selectedPreference,
	selectedRouteTypesToAvoid,
	selectedTravelMode,
	travelModes,
} = storeToRefs(useRoutingStore())
</script>
