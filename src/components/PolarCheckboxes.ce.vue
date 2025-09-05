<template>
	<fieldset class="kern-fieldset">
		<legend class="kern-label">
			{{ $t($props.legend, { ns: $props.localeNs }) }}
		</legend>
		<div class="kern-fieldset__body">
			<div
				v-for="({ label, value, disabled }, index) in $props.values"
				:key="`${value}-${index}`"
				class="kern-form-check"
				:class="{
					'polar-form-check-has-options': $props.options !== undefined,
				}"
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
				<button
					v-if="$props.options"
					class="kern-btn kern-btn--tertiary"
					:disabled="disabled"
				>
					<span
						:class="`kern-icon ${$props.options.icon}`"
						aria-hidden="true"
					/>
					<span class="kern-label kern-sr-only">
						{{ $t($props.options.label, { ns: $props.localeNs }) }}
					</span>
				</button>
			</div>
		</div>
	</fieldset>
</template>
<script setup lang="ts">
defineProps<{
	legend: string
	localeNs: string
	modelValue: string[]
	values: {
		label: string
		value: string
		disabled?: boolean
	}[]
	options?: {
		icon: string
		label: string
	}
}>()
const model = defineModel<string[]>({ required: true })
</script>

<style scoped>
.kern-label {
	padding-left: 0.75rem;
}

.kern-form-check {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	gap: var(--kern-metric-space-large, 1.5rem);
	padding-left: 0.75rem;
	padding-right: 0;
}

.polar-form-check-has-options {
	justify-content: space-between;
}

.kern-btn {
	width: var(--kern-metric-dimension-large);
	min-height: var(--kern-metric-dimension-large);
	border: none;
	border-radius: 50%;
}
</style>
