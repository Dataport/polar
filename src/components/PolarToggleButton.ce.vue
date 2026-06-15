<template>
	<fieldset class="polar-toggle-group">
		<legend class="kern-sr-only">{{ label }}</legend>
		<label
			v-for="option in options"
			:key="option.value"
			class="polar-toggle-group__option"
		>
			<input
				v-model="model"
				type="radio"
				class="kern-sr-only"
				:name="groupName"
				:value="option.value"
				:disabled="option.disabled"
			/>
			<span class="kern-btn kern-btn--tertiary polar-toggle-group__face">
				<span class="kern-icon" :class="option.icon" aria-hidden="true" />
				<span class="kern-sr-only">{{ option.label }}</span>
			</span>
		</label>
	</fieldset>
</template>

<script setup lang="ts">
import { type Ref, useId } from 'vue'

import type { Icon } from '@/core'

interface PolarToggleOption {
	label: string | Ref<string>
	value: string
	disabled?: boolean
	icon?: Icon
}

defineProps<{ label: string; options: PolarToggleOption[] }>()
const model = defineModel<string>({ required: true })
const groupName = useId()

// TODO(dopenguin): Different color scheme for the buttons?
</script>

<style scoped>
.polar-toggle-group {
	display: flex;
	gap: var(--kern-metric-space-x-small);
	width: 100%;
	margin: 0;
	border: 0;
	padding: var(--kern-metric-space-x-small);
	background-color: var(--kern-color-layout-background-hued);
	border-radius: var(--kern-metric-border-radius-default, 4px);

	.polar-toggle-group__option {
		display: flex;
		flex: 1;

		.polar-toggle-group__face {
			flex: 1;
			border: solid transparent;
			background: var(--kern-btn-background-color, transparent);
			transition: background-color 0.2s ease-out;

			.kern-icon {
				background-color: var(
					--kern-btn-text-color,
					var(--kern-color-action-default-contextual)
				);
				transition: inherit;
			}
		}
	}
}

.polar-toggle-group__option:hover .polar-toggle-group__face {
	border-color: var(--kern-color-action-default);
}

input:checked + .polar-toggle-group__face {
	--kern-btn-text-color: var(--kern-color-action-on-default-contextual);
	--kern-btn-background-color: var(--kern-color-action-default);
}

input:focus-visible + .polar-toggle-group__face {
	outline: 2px solid var(--kern-color-action-default);
	outline-offset: 2px;
}
</style>
