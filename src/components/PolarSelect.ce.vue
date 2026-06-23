<template>
	<div class="kern-form-input">
		<label
			:for="resolvedId"
			class="kern-label"
			:class="{ 'kern-sr-only': labelSrOnly }"
		>
			{{ label }}
		</label>
		<div class="kern-form-input__select-wrapper" :class="{ small }">
			<select
				:id="resolvedId"
				v-model="model"
				class="kern-form-input__select"
				:disabled
				:required
				:multiple
			>
				<option v-if="defaultLabel" value="">{{ defaultLabel }}</option>
				<option
					v-for="option of options"
					:key="option.value"
					:value="option.value"
					:aria-label="option.ariaLabel"
				>
					{{ option.label }}
				</option>
			</select>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

const props = defineProps<{
	options: {
		value: string | number
		label: string
		ariaLabel?: string
		[key: string]: unknown
	}[]
	label?: string
	labelSrOnly?: boolean
	defaultLabel?: string
	disabled?: boolean
	required?: boolean
	multiple?: boolean
	small?: boolean
	id?: string
}>()
const model = defineModel<string | string[]>({ required: true })

const fallbackId = useId()
const resolvedId = computed(() => props.id || fallbackId)
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
