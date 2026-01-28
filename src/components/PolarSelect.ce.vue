<template>
	<div class="kern-form-input">
		<label v-if="label" class="kern-label" :for="id">
			{{ label }}
		</label>
		<div class="kern-form-input__select-wrapper" :class="small ? 'small' : ''">
			<select
				:id="id"
				class="kern-form-input__select"
				:aria-label="ariaLabel"
				:disabled
				:required
				:multiple
				:value
				@change="onChange"
			>
				<option v-if="defaultLabel" value="">{{ defaultLabel }}</option>
				<!-- Intentional for straightforward API -->
				<!-- eslint-disable-next-line vue/no-template-shadow -->
				<option
					v-for="{ value, label, ariaLabel } of options"
					:key="value"
					:value="value"
					:aria-label="ariaLabel"
				>
					{{ label }}
				</option>
			</select>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

const props = withDefaults(
	defineProps<{
		label?: string
		ariaLabel?: string
		defaultLabel?: string
		value: string | string[]
		options: {
			value: string | number
			label: string
			ariaLabel?: string
			[key: string]: unknown
		}[]
		disabled?: boolean
		required?: boolean
		multiple?: boolean
		small?: boolean
		id?: string
	}>(),
	{
		label: '',
		ariaLabel: undefined,
		defaultLabel: '',
		disabled: false,
		required: false,
		multiple: false,
		small: false,
		id: '',
	}
)

const fallbackId = useId()

const id = computed(() => props.id || fallbackId)

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
		padding-top: 0;
		padding-bottom: 0;
	}

	&::after {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}

	&:hover:not(:focus-within)::after {
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
	}
}
</style>
