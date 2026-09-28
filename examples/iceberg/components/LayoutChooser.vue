<template>
	<fieldset class="kern-fieldset">
		<legend class="kern-label">Welches Kartenlayout möchten Sie nutzen?</legend>
		<div class="kern-fieldset__body">
			<div
				v-for="layout of layouts"
				:key="layout.value"
				class="kern-form-check"
			>
				<input
					:id="`${id}-${layout.value}`"
					v-model="store.mapConfiguration.layout"
					class="kern-form-check__radio"
					:name="`${id}-layout`"
					type="radio"
					:value="layout.value"
				/>
				<label :for="`${id}-${layout.value}`" class="kern-label">
					{{ layout.label }}
				</label>
			</div>
		</div>
	</fieldset>
</template>

<script setup lang="ts">
import type { MapConfiguration } from '@polar/polar'

import { useId } from 'vue'

import { useIcebergStore } from '../stores/iceberg'

const id = useId()
const store = useIcebergStore()

const layouts = [
	{
		value: 'standard',
		label: 'Standard-Layout',
	},
	{
		value: 'nineRegions',
		label: 'Klassisches Layout',
	},
] satisfies {
	value: MapConfiguration['layout']
	label: string
}[]
</script>
