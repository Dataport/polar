<template>
	<fieldset>
		<legend class="kern-sr-only">{{ label }}</legend>
		<label v-for="option in options" :key="option.value">
			<input
				v-model="model"
				type="radio"
				:name="groupName"
				:value="option.value"
				:disabled="option.disabled"
				:aria-label="unref(option.label)"
			/>
			<span class="kern-btn kern-btn--tertiary" aria-hidden="true">
				<span class="kern-icon" :class="option.icon" aria-hidden="true" />
			</span>
		</label>
	</fieldset>
</template>

<script setup lang="ts">
import { type Ref, unref, useId } from 'vue'

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
</script>

<style scoped>
fieldset {
	display: flex;
	gap: var(--kern-metric-space-x-small);
	width: 100%;
	margin: 0;
	border: 0;
	padding: var(--kern-metric-space-x-small);
	background-color: var(--kern-color-layout-background-hued);
	border-radius: var(--kern-metric-border-radius-default, 4px);

	label {
		display: flex;
		flex: 1;
		position: relative;

		input {
			position: absolute;
			inset: 0;
			opacity: 0;
			margin: 0;

			&:disabled {
				cursor: not-allowed;
			}
		}

		.kern-btn {
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

			@media (prefers-reduced-motion: reduce) {
				transition: none;
			}
		}

		&:hover {
			> input:not(:disabled):not(:checked) + .kern-btn {
				border-color: var(--kern-color-action-default);
			}

			> input:checked + .kern-btn {
				background: var(--kern-color-action-state-indicator-shade-hover);
			}
		}

		input:checked + .kern-btn {
			--kern-btn-text-color: var(--kern-color-action-on-default-contextual);
			--kern-btn-background-color: var(--kern-color-action-default);
		}

		input:focus-visible + .kern-btn {
			outline: 2px solid var(--kern-color-action-default);
			outline-offset: 2px;
		}

		input:disabled + .kern-btn {
			opacity: 0.4;
			cursor: not-allowed;
		}

		@media (forced-colors: active) {
			input:checked + .kern-btn {
				border-color: Highlight;
			}

			input:disabled + .kern-btn {
				border-color: GrayText;
			}
		}
	}
}
</style>
