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
					:id="`polar-radio-${value}-${index}`"
					v-model="model"
					class="kern-form-check__radio"
					:name="value"
					:value="value"
					type="radio"
					:disabled="disabled"
				/>
				<label class="kern-label" :for="`polar-radio-${value}-${index}`">
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
	values: {
		label: string
		value: string
		disabled?: boolean
	}[]
}>()
const model = defineModel<string>({ required: true })
</script>

<style scoped>
.kern-label {
	padding-left: 0.75rem;
}

.kern-form-check {
	align-items: center;
	gap: var(--kern-metric-space-large, 1.5rem);
	padding-left: 0.75rem;
	padding-right: 0;
}
</style>
