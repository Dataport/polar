<template>
	<input
		:id="id"
		v-model="model"
		type="checkbox"
		@keydown.prevent.enter="model = !model"
		@focus="scrollVisible($event)"
	/>
	<label :for="id" class="kern-btn kern-btn--block kern-btn--tertiary">
		<span v-if="icon" class="kern-icon" :class="icon" aria-hidden="true" />
		<span class="kern-label"><slot /></span>
	</label>
</template>

<script setup lang="ts">
import type { Icon } from '@/core'

import { useId } from 'vue'

defineProps<{ icon?: Icon }>()

const model = defineModel<boolean>({ required: true })

const id = useId()

function scrollVisible(evt: FocusEvent) {
	const target = evt.target as HTMLInputElement
	const label = target.parentElement?.querySelector(`label[for="${target.id}"]`)
	if (label?.scrollIntoView) {
		label.scrollIntoView({
			behavior: 'smooth',
			block: 'nearest',
			inline: 'nearest',
		})
	}
}
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

	&:focus-visible + label {
		padding: var(--kern-metric-space-none) var(--kern-metric-space-default);
		border-radius: var(--kern-metric-border-radius-default);
		outline: 4px solid var(--kern-color-action-focus-default-contextual);
		outline-offset: 2px;
	}

	&:checked + label {
		border-color: var(--kern-color-action-default);
	}
}
</style>
