<template>
	<span
		v-if="showLabel"
		:id="`${idPrefix}-label`"
		class="polar-result-list-category-label"
	>
		{{ categoryLabel }}
		{{
			$t(($) => $.resultList.count, { count: features.length, ns: 'shared' })
		}}
	</span>
	<ul
		:aria-labelledby="showLabel ? `${idPrefix}-label` : undefined"
		:class="{ 'polar-result-list-without-label': !showLabel }"
	>
		<template
			v-for="(feature, j) in features.slice(
				0,
				expanded ? features.length : limitedResults
			)"
			:key="`result-${j}`"
		>
			<li
				:id="`${idPrefix}-${j}`"
				tabindex="-1"
				@click="emit('selectResult', feature, categoryId)"
				@keydown.enter.prevent.stop="emit('selectResult', feature, categoryId)"
			>
				<span class="span-sr-only">{{ feature.title }}</span>
				<!-- eslint-disable vue/no-v-html -->
				<span
					aria-hidden="true"
					v-html="strongTitleByInput(feature.title, inputValue)"
				/>
				<slot />
			</li>
		</template>
	</ul>
	<KernButton
		v-if="features.length > limitedResults"
		class="kern-btn--tertiary"
		:icon="
			expanded
				? 'kern-icon--keyboard-arrow-up'
				: 'kern-icon--keyboard-arrow-down'
		"
		@click="expanded = !expanded"
	>
		{{
			$t(($) => $.resultList[expanded ? 'reduce' : 'extend'], {
				ns: 'shared',
			})
		}}
	</KernButton>
</template>

<script setup lang="ts">
import type { PolarGeoJsonFeature } from '@/core'

import { ref } from 'vue'

import KernButton from '@/components/kern/KernButton.ce.vue'
import { strongTitleByInput } from '@/lib/strongTitleByInput'

defineProps<{
	categoryId: string
	categoryLabel: string
	features: PolarGeoJsonFeature[]
	inputValue: string
	limitedResults: number
	showLabel: boolean

	/** Ids of items are `${idPrefix}-${featureIndex}`. */
	idPrefix: string
}>()

const emit = defineEmits<{
	selectResult: [PolarGeoJsonFeature, string]
}>()

const expanded = ref(false)
</script>

<style scoped>
.polar-result-list-category-label {
	display: flex;
	align-items: center;
	min-height: var(--kern-metric-dimension-large);
	padding: 0 var(--kern-metric-space-small);
	margin: 0;
	font-size: calc(var(--kern-typography-font-size-small-static) * 0.875);
	font-weight: normal;
	color: var(--kern-color-layout-text-muted);
}

.polar-result-list-without-label {
	margin-top: var(--kern-metric-space-x-small);
}

ul {
	margin: 0;
	padding: 0;

	li {
		display: flex;
		align-items: center;
		min-height: var(--kern-metric-dimension-x-large);
		padding: var(--kern-metric-space-2x-small) var(--kern-metric-space-small);
		margin: var(--kern-metric-space-none) var(--kern-metric-space-small);
		border-radius: var(--kern-metric-border-radius-default);
		color: var(--kern-color-layout-text-default);
		transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);

		span[aria-hidden='true'] {
			white-space: normal;
			overflow-wrap: anywhere;
		}

		&:hover,
		&:focus {
			background-color: var(--kern-color-layout-background-hued);
			cursor: pointer;
		}
	}
}

button {
	margin: var(--kern-metric-space-none) var(--kern-metric-space-small);
}

/* Copy of kern-sr-only with a normal height so screen reader focus is correct */
.span-sr-only {
	width: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip-path: circle(0);
	white-space: nowrap;
	border: 0;
}
</style>
