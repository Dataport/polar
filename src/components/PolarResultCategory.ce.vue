<template>
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
			v-for="(feature, j) in result.features.features"
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
		v-if="searchResults[index].features.features.length > limitedResults"
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

import { computed, ref } from 'vue'

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
