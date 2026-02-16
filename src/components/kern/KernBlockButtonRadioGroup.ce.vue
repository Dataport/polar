<template>
	<div class="radiogroup" role="radiogroup">
		<template v-for="(item, idx) of props.items" :key="item.value">
			<span
				ref="radios"
				role="radio"
				:aria-checked="model === item.value"
				:aria-labelledby="id + '*' + item.value"
				tabindex="0"
				:data-value="item.value"
				@keydown.prevent.space="model = item.value"
				@keydown.prevent.enter="model = item.value"
				@focus="scrollVisible($event)"
			/>
			<label
				:id="id + '*' + item.value"
				class="kern-btn kern-btn--block kern-btn--tertiary"
				@click.prevent="((model = item.value), radios?.[idx].focus())"
			>
				<span
					v-if="item.icon"
					:class="{ 'kern-icon': true, [item.icon]: true }"
					aria-hidden="true"
				/>
				<span class="kern-label">{{ item.label }}</span>
			</label>
		</template>
	</div>
</template>

<script setup lang="ts">
import { useId, useTemplateRef } from 'vue'

import type { Icon } from '@/core'

const props = defineProps<{
	items: {
		value: string
		label: string
		icon?: Icon | false
	}[]
}>()

const model = defineModel<string>({ required: true })

const id = useId()

const radios = useTemplateRef<HTMLInputElement>('radios')

function scrollVisible(evt: FocusEvent) {
	const target = evt.target as HTMLInputElement
	const label = target.parentElement?.querySelector(
		`label[id="${target.getAttribute('aria-labelledby')}"]`
	)
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
.radiogroup {
	display: contents;
}

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

[role='radio'] {
	position: absolute;
	height: 0;
	clip-path: circle(0);

	&:focus-visible + label {
		padding: var(--kern-metric-space-none) var(--kern-metric-space-default);
		border-radius: var(--kern-metric-border-radius-default);
		box-shadow:
			0 0 0 2px var(--kern-color-action-on-default),
			0 0 0 4px var(--kern-color-action-focus-border-inside),
			0 0 0 6px var(--kern-color-action-focus-border-outside);
	}

	&[aria-checked='true'] + label {
		border-color: var(--kern-color-action-default);
	}
}
</style>
