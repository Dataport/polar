<template>
	<div
		v-if="featuresAvailable"
		id="polar-plugin-address-search-result-wrapper"
		:style="`max-height: ${maxHeight}`"
	>
		<template v-for="(result, i) in results" :key="result.categoryId">
			<span
				v-if="results.length > 1"
				class="polar-plugin-address-search-category-label"
			>
				{{ result.categoryLabel }}
				{{
					$t(($) => $.resultCount, {
						count: searchResults[i].features.features.length,
						ns: PluginId,
					})
				}}
			</span>
			<ul tabindex="-1">
				<template
					v-for="(feature, j) in result.features.features"
					:key="`result-${i}-${j}`"
				>
					<li
						:id="`polar-plugin-address-search-results-feature-${i}-${j}`"
						tabindex="-1"
						@click="addressSearchStore.selectResult(feature, result.categoryId)"
						@keydown.enter.prevent.stop="
							addressSearchStore.selectResult(feature, result.categoryId)
						"
						@keydown.down.prevent.stop="
							(event) => focusNextElement(true, event)
						"
						@keydown.up.prevent.stop="(event) => focusNextElement(false, event)"
						@keydown.escape.prevent.stop="escapeResults"
					>
						<!-- eslint-disable vue/no-v-html -->
						<span v-html="strongTitleByInput(feature.title, inputValue)" />
						<!-- eslint-enable vue/no-v-html -->
						<component
							:is="afterResultComponent"
							v-if="afterResultComponent"
							:feature="feature"
						/>
					</li>
				</template>
			</ul>
			<button
				v-if="searchResults[i].features.features.length > limitResults"
				class="kern-btn kern-btn--tertiary"
				@keydown.down.prevent.stop="(event) => focusNextElement(true, event)"
				@keydown.up.prevent.stop="(event) => focusNextElement(false, event)"
				@click="toggle(result.categoryId)"
			>
				<span
					:class="`kern-icon ${areResultsExpanded(result.categoryId) ? 'kern-icon--keyboard-arrow-up' : 'kern-icon--keyboard-arrow-down'}`"
					aria-hidden="true"
				/>
				<span class="kern-label">
					{{
						$t(
							($) =>
								$.resultList[
									areResultsExpanded(result.categoryId) ? 'reduce' : 'extend'
								],
							{ ns: PluginId }
						)
					}}
				</span>
			</button>
			<!-- TODO: Add divider -->
		</template>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref, toRaw, watch } from 'vue'
import { useAddressSearchStore } from '../store'
import { PluginId, type SearchResult } from '../types'
import { strongTitleByInput } from '../utils/strongTitleByInput'
import { useCoreStore } from '@/core/stores/export'

const coreStore = useCoreStore()
const addressSearchStore = useAddressSearchStore()
const {
	afterResultComponent,
	featuresAvailable,
	inputValue,
	limitResults,
	searchResults,
	selectedGroupId,
} = storeToRefs(addressSearchStore)

// Reset opened categories on group change
watch(selectedGroupId, () => (openCategories.value = []))

const openCategories = ref<string[]>([])

const maxHeight = computed(() =>
	coreStore.hasWindowSize ? 'inherit' : `${coreStore.clientHeight * 0.8}px`
)

const results = computed<SearchResult[]>(() =>
	Array.isArray(addressSearchStore.searchResults)
		? // If we do not clone, we'd still copy references on the deeper levels
			structuredClone(toRaw(addressSearchStore.searchResults) as SearchResult[])
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
				.filter(
					(result) => result.groupId === addressSearchStore.selectedGroupId
				)
				.map((result) => {
					if (areResultsExpanded(result.categoryId)) {
						return result
					}

					result.features.features = result.features.features.slice(
						0,
						limitResults.value
					)
					return result
				})
		: []
)

function areResultsExpanded(category: string) {
	return openCategories.value.includes(category)
}

function escapeResults() {
	;(coreStore.shadowRoot as ShadowRoot)
		.getElementById('polar-plugin-address-search-input')
		?.focus()
}

function focusNextElement(down: boolean, event: KeyboardEvent): void {
	const { target } = event

	if (target === null) {
		console.warn('Could not focus any element.')
		return
	}

	const wrapper = coreStore.shadowRoot?.getElementById(
		'polar-plugin-address-search-result-wrapper'
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
		.getElementById('polar-plugin-address-search-input')
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
#polar-plugin-address-search-result-wrapper {
	width: 100%;
	padding-bottom: 0.625rem;
	overflow-y: auto;

	.polar-plugin-address-search-category-label {
		display: flex;
		align-items: center;
		height: var(--kern-metric-dimension-x-large);
		padding: 0 var(--kern-metric-space-small);
		font-size: 0.875rem;
		color: var(--kern-color-layout-text-muted);
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
		width: 95%;
		margin: var(--kern-metric-space-none) var(--kern-metric-space-small);
	}
}
</style>
