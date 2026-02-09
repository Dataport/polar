<template>
	<input :id="id" v-model="model" type="checkbox" />
	<label :for="id" class="kern-btn kern-btn--block kern-btn--tertiary">
		<span
			v-if="props.icon"
			:class="{ 'kern-icon': true, [props.icon]: true }"
			aria-hidden="true"
		/>
		<span class="kern-label">{{ props.label }}</span>
	</label>
</template>

<script setup lang="ts">
import { useId } from 'vue'

import type { Icon } from '@/core'

const props = defineProps<{
	icon?: Icon | false
	label: string
}>()

const model = defineModel<boolean>({ required: true })

const id = useId()
</script>

<style scoped>
.kern-btn--tertiary {
	background-color: #edf1fa;
	justify-content: left;

	.kern-label {
		text-decoration: none;
	}
}

label {
	border: var(--kern-metric-border-width-default) solid transparent;
}

input[type='checkbox'] {
	position: absolute;
	height: 0;
	clip-path: circle(0);

	&:focus + label {
		padding: var(--kern-metric-space-none) var(--kern-metric-space-default);
		border-radius: var(--kern-metric-border-radius-default);
		box-shadow:
			0 0 0 2px var(--kern-color-action-on-default),
			0 0 0 4px var(--kern-color-action-focus-border-inside),
			0 0 0 6px var(--kern-color-action-focus-border-outside);
	}

	&:checked + label {
		border-color: var(--kern-color-action-default);
	}
}
</style>
