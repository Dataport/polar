<template>
	<div
		v-if="featuresAvailable"
		:id="`polar-result-list-${componentId}-wrapper`"
		class="polar-result-list-wrapper"
		tabindex="-1"
	>
		<template v-for="(result, i) in results" :key="result.categoryId">
			<PolarResultCategory
				:index="i"
				:result="result"
				:input-value="props.inputValue"
				:limited-results="props.limitedResults"
				:results-length="results.length"
				:category-id="result.categoryId"
				:category-label="result.categoryLabel"
				:component-id="props.componentId"
				:search-results="props.searchResults"
				:selected-group-id="props.selectedGroupId"
				@focus-next-element="focusNextElement"
				@select-result="
					(feature, categoryId) => emit('selectResult', feature, categoryId)
				"
			/>
		</template>
	</div>
</template>

<script setup lang="ts">
import type { PolarGeoJsonFeature, SearchResult } from '@/core'

import { computed, nextTick, toRaw, watch } from 'vue'

import PolarResultCategory from '@/components/PolarResultCategory.ce.vue'
import { useCoreStore } from '@/core/stores'
import { focusFirstResult } from '@/lib/focusFirstResult'

const props = defineProps<{
	componentId: string
	searchResults: SearchResult[] | symbol
	limitedResults: number
	inputValue: string
	selectedGroupId: string
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
		: []
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
</script>

<style scoped>
.polar-result-list-wrapper {
	display: flex;
	flex-direction: column;
	gap: var(--kern-metric-space-2x-small);
	width: 100%;
	padding-bottom: 0.625rem;
	overflow-y: auto;
}
</style>
