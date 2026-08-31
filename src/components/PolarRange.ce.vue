<template>
	<div class="kern-form-input">
		<label :for="resolvedId" class="kern-label">
			{{ label }}
		</label>
		<div class="polar-range-container">
			<input
				:id="resolvedId"
				v-model.number="model"
				class="polar-range"
				type="range"
				:name="name"
				:min="min"
				:max="max"
				:step="step"
				:disabled
			/>
			<slot>{{ model }}</slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

const props = defineProps<{
	name: string
	label: string
	min: number
	max: number
	step?: number
	disabled?: boolean
	id?: string
}>()
const model = defineModel<number>({ required: true })

const fallbackId = useId()
const resolvedId = computed(() => props.id || fallbackId)
</script>

<style scoped>
.polar-range-container {
	display: flex;
	align-items: center;
	gap: var(--kern-metric-space-default);
	width: 100%;

	.polar-range {
		flex-grow: 1;
	}
}
</style>
