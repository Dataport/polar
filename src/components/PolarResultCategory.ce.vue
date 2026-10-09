<template class="polar-result-list-category">
	<span
		v-if="resultsLength > 1"
		:id="`polar-result-list-${componentId}-${categoryId}`"
		class="polar-result-list-category-label"
	>
		{{ categoryLabel }}
		<slot name="result-count-label" :count="getResultCount(categoryId)" />
	</span>
	<ul
		:aria-labelledby="`polar-result-list-${componentId}-${categoryId}`"
		:class="{
			'polar-result-list-without-label': resultsLength === 1,
		}"
	>
		<template
			v-for="(feature, j) in result.features.features.slice(
				0,
				areResultsExpanded(categoryId)
					? result.features.features.length
					: limitedResults
			)"
			:key="`result-${index}-${j}`"
		>
			<li
				:id="`polar-result-list-${componentId}-results-feature-${index}-${j}`"
				tabindex="-1"
				@click="emit('selectResult', feature, categoryId)"
				@keydown.enter.prevent.stop="emit('selectResult', feature, categoryId)"
				@keydown.down.prevent.stop="
					(event) => emit('focusNextElement', true, event)
				"
				@keydown.up.prevent.stop="
					(event) => emit('focusNextElement', false, event)
				"
				@keydown.escape.prevent.stop="emit('escapeResults')"
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
		v-if="result.features.features.length > limitedResults"
		class="kern-btn--tertiary"
		:icon="
			areResultsExpanded(categoryId)
				? 'kern-icon--keyboard-arrow-up'
				: 'kern-icon--keyboard-arrow-down'
		"
		@keydown.down.prevent.stop="
			(event) => emit('focusNextElement', true, event)
		"
		@keydown.up.prevent.stop="(event) => emit('focusNextElement', false, event)"
		@click="toggle(categoryId)"
	>
		<slot name="toggle-label" :expanded="areResultsExpanded(categoryId)" />
	</KernButton>
	<hr
		v-if="index < resultsLength - 1"
		class="kern-divider"
		aria-hidden="true"
	/>
</template>

<script setup lang="ts">
import type { PolarGeoJsonFeature, SearchResult } from '@/core'

import { computed, ref, watch } from 'vue'

import KernButton from '@/components/kern/KernButton.ce.vue'
import { strongTitleByInput } from '@/lib/strongTitleByInput'

const props = defineProps<{
	index: number
	result: SearchResult
	inputValue: string
	limitedResults: number
	resultsLength: number
	categoryId: string
	categoryLabel: string
	componentId: string
	searchResults: SearchResult[] | symbol
	selectedGroupId: string
}>()

const emit = defineEmits<{
	selectResult: [PolarGeoJsonFeature, string]
	focusNextElement: [boolean, KeyboardEvent]
	escapeResults: []
}>()

watch(
	() => props.selectedGroupId,
	() => (openCategories.value = [])
)

const resultsBySearchMethod = computed(() =>
	Array.isArray(props.searchResults) ? props.searchResults : []
)

const openCategories = ref<string[]>([])

function getResultCount(categoryId: string) {
	return resultsBySearchMethod.value
		.filter(
			(result) =>
				result.groupId === props.selectedGroupId &&
				result.categoryId === categoryId
		)
		.reduce((sum, result) => sum + result.features.features.length, 0)
}

function areResultsExpanded(category: string) {
	return openCategories.value.includes(category)
}

function toggle(category: string) {
	openCategories.value =
		openCategories.value.indexOf(category) === -1
			? [...openCategories.value, category]
			: openCategories.value.filter((s) => s !== category)
}
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
		align-items: flex-start;
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
