<template>
	<fieldset class="kern-fieldset">
		<legend class="kern-label">
			Wie soll die Auswahl für das GFI-Plugin ablaufen?
		</legend>
		<div class="kern-fieldset__body">
			<div
				v-for="mode of selectionModes"
				:key="mode.value"
				class="kern-form-check"
			>
				<input
					:id="`${id}-${mode.value}`"
					v-model="selectionMode"
					class="kern-form-check__radio"
					:name="`${id}-layout`"
					type="radio"
					:value="mode.value"
				/>
				<label :for="`${id}-${mode.value}`" class="kern-label">
					{{ mode.label }}
				</label>
			</div>
		</div>
	</fieldset>
</template>

<script setup lang="ts">
import type { MapConfiguration } from '@polar/polar'

import { isEqual } from 'es-toolkit'
import { computed, useId } from 'vue'

import { useIcebergStore } from '../stores/iceberg'

const id = useId()
const store = useIcebergStore()

const selectionModes = [
	{
		value: 'direct',
		label: 'Direkte Auswahl',
		config: {
			directSelect: true,
		},
	},
	{
		value: 'multi',
		label: 'Mehrfachauswahl',
		config: {
			directSelect: true,
			multiSelect: 'box',
		},
	},
	{
		value: 'pins',
		label: 'Auswahl über das Pins-Plugin',
		config: {
			coordinateSources: [
				{
					plugin: 'pins',
					key: 'coordinate',
				},
			],
		},
	},
] satisfies {
	value: 'direct' | 'multi' | 'pins'
	label: string
	config: Partial<MapConfiguration['gfi']>
}[]

const selectionMode = computed({
	get: () =>
		selectionModes.find((mode) =>
			isEqual(mode.config, store.mapConfiguration.gfi)
		)?.value || 'direct',
	set: (value) => {
		store.mapConfiguration.gfi = selectionModes.find(
			(mode) => mode.value === value
		)?.config as MapConfiguration['gfi']
	},
})
</script>
