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
	display: none;

	&:checked + label {
		border-color: var(--kern-color-action-default);
	}
}
</style>
