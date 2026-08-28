<template>
	<div class="polar-search-input-wrapper">
		<span class="kern-icon kern-icon--search" aria-hidden="true" />
		<span :id="props.describedByText" class="kern-sr-only">
			{{ props.descriptionForAria }}
		</span>
		<input
			:id="inputId"
			class="kern-form-input__input polar-search-input"
			name="polar-search-input"
			type="text"
			:aria-label="props.labelText"
			:aria-described-by="props.describedByText"
			:value="props.inputValue"
			v-bind="$attrs"
			@input="
				$emit('update:inputValue', ($event.target as HTMLInputElement).value)
			"
		/>
		<SmallLoader v-if="props.isLoading" class="polar-search-input-loader" />
		<KernButton
			v-if="props.showClearButton"
			:class="`kern-btn--tertiary polar-search-input-button`"
			:style="`right: ${slotPlacement}; top: ${slotPlacement}`"
			icon="kern-icon--close"
			:label-sr-only="true"
			@click="() => $emit('clear')"
		>
			{{ clearLabel }}
		</KernButton>
		<!-- Additionally needed so screen readers can detect the aria live region -->
		<span class="kern-sr-only" aria-live="polite">
			{{ hint }}
		</span>
		<span v-if="hint.length" class="polar-search-input-hint">
			{{ hint }}
		</span>
	</div>
</template>

<script setup lang="ts">
import type { VueElement } from 'vue'

import { computed } from 'vue'

import KernButton from '@/components/kern/KernButton.ce.vue'
import SmallLoader from '@/components/SmallLoader.ce.vue'

const props = defineProps<{
	inputId: string
	inputValue: string
	labelText: string
	describedByText: string
	descriptionForAria: string
	layout: 'standard' | 'nineRegions' | VueElement
	isLoading?: boolean
	showClearButton: boolean
	clearLabel: string
	hint: string
}>()

defineEmits<{
	'update:inputValue': [string]
	clear: []
}>()

defineOptions({
	inheritAttrs: false,
})

const slotPlacement = computed(() => {
	console.warn(props.layout)
	return props.layout === 'standard' ? '0' : 'var(--kern-metric-space-small)'
})
</script>

<style scoped>
.polar-search-input-wrapper {
	position: relative;
	display: grid;
	grid-template-columns: auto minmax(0, 1fr);
	grid-template-rows: auto auto;
	align-items: center;
	width: 100%;
	column-gap: var(--kern-metric-space-small);

	.kern-icon--search {
		grid-column: 1;
		grid-row: 1;
		width: var(--kern-metric-dimension-large);
		height: var(--kern-metric-dimension-large);
	}

	.polar-search-input {
		grid-column: 2;
		grid-row: 1;
		border-radius: var(--kern-metric-border-radius-small);
		background: var(--kern-color-form-input-background);
		padding-right: calc(var(--kern-metric-space-large) * 2);
	}

	.polar-search-input-button.kern-btn {
		position: absolute;
		right: 0;
		top: 0;
		border-radius: var(--kern-metric-border-radius-small);
		width: var(--kern-metric-dimension-large);
		min-height: var(--kern-metric-dimension-large);
	}

	.polar-search-input-loader.kern-loader {
		position: absolute;
		right: 0;
		top: 0;
	}

	.polar-search-input-hint {
		grid-column: 2;
		grid-row: 2;
		color: var(--kern-color-layout-text-muted);
		font-size: calc(var(--kern-typography-font-size-small-static) * 0.875);
		padding: 0 var(--kern-metric-space-2x-small);
		margin-top: var(--kern-metric-space-small);
	}
}
</style>
