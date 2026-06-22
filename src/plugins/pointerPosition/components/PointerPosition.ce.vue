<template>
	<div
		class="polar-plugin-pointer-position"
		:title="$t(($) => $.label, { ns: PluginId })"
		:aria-label="$t(($) => $.label, { ns: PluginId })"
	>
		<span class="kern-icon kern-icon--point-scan" aria-hidden="true" />
		<PolarSelect
			v-if="availableProjections.length > 1"
			:value="String(selectedProjection)"
			:options="
				availableProjections.map((projection) => ({
					value: projection.code,
					label: projection.code,
					ariaLabel: projection.code,
				}))
			"
			:aria-label="$t(($) => $.projectionSelect.label, { ns: PluginId })"
			small
			@update:value="(value) => (selectedProjection = value)"
		/>
		<small v-else>
			{{ selectedProjection }}
		</small>
		<span>
			{{ formattedPointerPosition }}
		</span>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import PolarSelect from '@/components/PolarSelect.ce.vue'

import { usePointerPositionStore } from '../store'
import { PluginId } from '../types'

const pointerPositionStore = usePointerPositionStore()

const { formattedPointerPosition, availableProjections, selectedProjection } =
	storeToRefs(pointerPositionStore)
</script>

<style scoped>
.polar-plugin-pointer-position {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: center;

	gap: var(--kern-metric-space-small);
	padding: var(--kern-metric-space-2x-small) var(--kern-metric-space-small);
	border-radius: var(--kern-metric-border-radius-large);

	color: var(--kern-color-layout-text-default);
	background-color: var(--kern-color-form-input-background-inverted);
	box-shadow: var(--polar-shadow);
}
</style>
