<template>
	<div class="kern-form-input">
		<label v-if="label" class="kern-label" :for="name">
			{{ label }}
		</label>
		<div class="kern-form-input__select-wrapper" :class="small ? 'small' : ''">
			<select
				class="kern-form-input__select"
				:name="name"
				:disabled
				:required
				:multiple
				:value
				@change="onChange"
			>
				<option v-if="defaultLabel" value="">{{ defaultLabel }}</option>
				<!-- Intentional for straightforward API -->
				<!-- eslint-disable-next-line vue/no-template-shadow -->
				<option v-for="{ value, label } of options" :key="value" :value="value">
					{{ label }}
				</option>
			</select>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useId } from 'vue'

const props = withDefaults(
	defineProps<{
		label?: string
		defaultLabel?: string
		value: string | string[]
		options: { value: string | number; label: string; [key: string]: unknown }[]
		disabled?: boolean
		required?: boolean
		multiple?: boolean
		small?: boolean
		name?: string
	}>(),
	{
		label: '',
		defaultLabel: '',
		disabled: false,
		required: false,
		multiple: false,
		small: false,
		name: useId(),
	}
)

const emit = defineEmits<{
	(e: 'update:value', value: string | string[]): void
}>()

function onChange(event: Event) {
	const target = event.target as HTMLSelectElement
	if (props.multiple) {
		const selected = Array.from(target.selectedOptions).map((opt) => opt.value)
		emit('update:value', selected)
	} else {
		emit('update:value', target.value)
	}
}
</script>

<style scoped>
.kern-form-input__select-wrapper.small {
	height: var(--kern-metric-dimension-default);

	.kern-form-input__select {
		padding: 0 var(--kern-40) 0 var(--kern-metric-space-default);
	}

	&::after {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}

	&:hover:not(:focus-within)::after {
		position: absolute;
		top: calc(
			50% +
				calc(
					calc(
							var(--kern-metric-border-width-bold) -
								var(--kern-metric-border-width-default)
						) /
						2
				)
		);
		transform: translateY(-50%);
	}
}
</style>
