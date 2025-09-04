<template>
	<fieldset class="kern-fieldset">
		<legend class="kern-label">
			{{ $t($props.legend, { ns: $props.legendNs }) }}
		</legend>
		<div class="kern-fieldset__body">
			<div
				v-for="({ label, value, disabled }, index) in $props.values"
				:key="`${value}-${index}`"
				class="kern-form-check"
			>
				<input
					:id="`polar-checkbox-${value}-${index}`"
					v-model="model"
					class="kern-form-check__checkbox"
					:name="value"
					:value="value"
					type="checkbox"
					:disabled="disabled"
				/>
				<label class="kern-label" :for="`polar-checkbox-${value}-${index}`">
					{{ label }}
				</label>
			</div>
		</div>
	</fieldset>
</template>
<script setup lang="ts">
defineProps<{
	legend: string
	legendNs: string
	modelValue: string[]
	values: {
		label: string
		value: string
		disabled?: boolean
	}[]
}>()
const model = defineModel<string[]>({ required: true })
</script>

<style scoped>
.kern-label {
	padding-left: 0.75rem;
}

.kern-form-check {
	gap: var(--kern-metric-space-large, 1.5rem);
	padding-left: 0.75rem;
	padding-right: 0;
}
</style>
