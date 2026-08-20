<template>
	<div
		v-if="featuresAvailable"
		:id="`polar-result-list-${componentId}-wrapper`"
		class="polar-result-list-wrapper"
		tabindex="-1"
	>
		<template v-for="(result, i) in results" :key="result.categoryId">
			<span
				v-if="results.length > 1"
				:id="`polar-result-list-${componentId}-${result.categoryId}`"
				class="polar-result-list-category-label"
			>
				{{ result.categoryLabel }}
				{{ resultCountLabel(getResultCount(result.categoryId)) }}
			</span>
			<ul
				:aria-labelledby="`polar-result-list-${componentId}-${result.categoryId}`"
				:class="{
					'polar-result-list-without-label': results.length === 1,
				}"
			>
				<template
					v-for="(feature, j) in result.features.features"
					:key="`result-${i}-${j}`"
				>
					<li
						:id="`polar-result-list-${componentId}-results-feature-${i}-${j}`"
						tabindex="-1"
						@click="emit('selectResult', feature, result.categoryId)"
						@keydown.enter.prevent.stop="
							emit('selectResult', feature, result.categoryId)
						"
						@keydown.down.prevent.stop="
							(event) => focusNextElement(true, event)
						"
						@keydown.up.prevent.stop="(event) => focusNextElement(false, event)"
						@keydown.escape.prevent.stop="escapeResults"
					>
						<span class="span-sr-only">{{ feature.title }}</span>
						<!-- eslint-disable vue/no-v-html -->
						<span
							aria-hidden="true"
							v-html="strongTitleByInput(feature.title, inputValue)"
						/>
						<!-- eslint-enable vue/no-v-html -->
						<component
							:is="afterResultComponent"
							v-if="afterResultComponent"
							:feature="feature"
						/>
					</li>
				</template>
			</ul>
			<KernButton
				v-if="searchResults[i].features.features.length > limitedResults"
				class="kern-btn--tertiary"
				:icon="
					areResultsExpanded(result.categoryId)
						? 'kern-icon--keyboard-arrow-up'
						: 'kern-icon--keyboard-arrow-down'
				"
				@keydown.down.prevent.stop="(event) => focusNextElement(true, event)"
				@keydown.up.prevent.stop="(event) => focusNextElement(false, event)"
				@click="toggle(result.categoryId)"
			>
				{{ toggleLabel(areResultsExpanded(result.categoryId)) }}
			</KernButton>
			<hr
				v-if="i < results.length - 1"
				class="kern-divider"
				aria-hidden="true"
			/>
		</template>
	</div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import type { PolarGeoJsonFeature, PolarGeoJsonFeatureCollection } from '@/core'

import { computed, nextTick, ref, toRaw, watch } from 'vue'

import { focusFirstResult } from '@/lib/focusFirstResult'

interface SearchResult {
	categoryId: string
	categoryLabel: string
	features: PolarGeoJsonFeatureCollection
	groupId: string
}

import KernButton from '@/components/kern/KernButton.ce.vue'
import { useCoreStore } from '@/core/stores'
import { strongTitleByInput } from '@/lib/strongTitleByInput'

const props = defineProps<{
	componentId: string
	searchResults: SearchResult[] | symbol
	afterResultComponent?: Component | null
	limitedResults: number
	inputValue: string
	selectedGroupId: string
	resultCountLabel: (count: number) => string
	toggleLabel: (expanded: boolean) => string
	focusAfterSearch: boolean
	focusReturnTargetId?: string
	resultItemIdPrefix?: string
}>()

const emit = defineEmits<{
	selectResult: [PolarGeoJsonFeature, string]
}>()

const coreStore = useCoreStore()

const featuresAvailable = computed(
	() =>
		Array.isArray(props.searchResults) &&
		props.searchResults.length > 0 &&
		props.searchResults.some(
			({ features: { features } }) =>
				Array.isArray(features) && features.length > 0
		)
)

const defaultFocusReturnTargetId = computed(() => {
	return (
		props.focusReturnTargetId ?? `polar-result-list-${props.componentId}-input`
	)
})
const defaultResultItemIdPrefix = computed(() => {
	return (
		props.resultItemIdPrefix ??
		`polar-result-list-${props.componentId}-results-feature`
	)
})

const resultsBySearchMethod = computed(() =>
	Array.isArray(props.searchResults) ? props.searchResults : []
)
const openCategories = ref<string[]>([])

const results = computed<SearchResult[]>(() =>
	Array.isArray(resultsBySearchMethod.value)
		? // If we do not clone, we'd still copy references on the deeper levels
			structuredClone(toRaw(resultsBySearchMethod.value))
				.filter((result) => result.groupId === props.selectedGroupId)
				.reduce<SearchResult[]>((acc, curr) => {
					const index = acc.findIndex(
						(val) => val.categoryId === curr.categoryId
					)
					if (index === -1) {
						return [...acc, curr]
					}
					;(acc[index] as SearchResult).features.features = [
						...(acc[index] as SearchResult).features.features,
						...curr.features.features,
					]

					return acc
				}, [])
				.map((result) => {
					if (areResultsExpanded(result.categoryId)) {
						return result
					}

					result.features.features = result.features.features.slice(
						0,
						props.limitedResults
					)
					return result
				})
		: []
)

watch(
	() => props.selectedGroupId,
	() => (openCategories.value = [])
)

watch(results, () => {
	if (props.focusAfterSearch && coreStore.shadowRoot) {
		void nextTick(() => {
			focusFirstResult(
				results.value.length,
				coreStore.shadowRoot as ShadowRoot,
				defaultResultItemIdPrefix.value
			)
		})
	}
})

// function translate(text: string, textNs?: string): string {
// 	// @ts-expect-error | Locale keys are dynamic.
// 	return t(text, { ns: textNs })
// }

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

function escapeResults() {
	;(coreStore.shadowRoot as ShadowRoot)
		.getElementById(defaultFocusReturnTargetId.value)
		?.focus()
}

function focusNextElement(down: boolean, event: KeyboardEvent): void {
	const { target } = event

	if (target === null) {
		console.warn('Could not focus any element.')
		return
	}

	const wrapper = coreStore.shadowRoot?.getElementById(
		`polar-result-list-${props.componentId}-wrapper`
	) as HTMLDivElement
	const elements = wrapper.querySelectorAll('li, button')

	const index = [...elements].indexOf(target as Element)
	// Gets the next or previous element in the list of all available results and expansion buttons.
	const nextElement = elements[(index + (down ? 1 : -1)) % elements.length]
	if (nextElement) {
		// @ts-expect-error | we have no non-HTML elements in this DOM part.
		nextElement.focus()
		return
	}

	;(coreStore.shadowRoot as ShadowRoot)
		.getElementById(defaultFocusReturnTargetId.value)
		?.focus()
}

function toggle(category: string) {
	openCategories.value =
		openCategories.value.indexOf(category) === -1
			? [...openCategories.value, category]
			: openCategories.value.filter((s) => s !== category)
}
</script>

<style scoped>
.polar-result-list-wrapper {
	display: flex;
	flex-direction: column;
	gap: var(--kern-metric-space-2x-small);
	width: 100%;
	padding-bottom: 0.625rem;
	overflow-y: auto;

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
			padding: var(--kern-metric-space-none) var(--kern-metric-space-small);
			margin: var(--kern-metric-space-none) var(--kern-metric-space-small);
			border-radius: var(--kern-metric-border-radius-default);
			color: var(--kern-color-layout-text-default);
			transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);

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
