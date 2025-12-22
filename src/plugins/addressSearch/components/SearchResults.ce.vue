<template>
	<!-- TODO: migrate search functionality one after another -->
	<!-- TODO: All search functions should be moved to the lib package so they may be used in Routing as well  -->
	<div
		v-if="Array.isArray(searchResults) && featuresAvailable"
		class="polar-plugin-address-search-result-wrapper"
	>
		<template v-for="(result, i) in searchResults" :key="result.categoryId">
			<span>
				{{ result.categoryLabel }}
				{{
					$t(($) => $.resultCount, {
						count: result.features.features.length,
						ns: PluginId,
					})
				}}
			</span>
			<ul :style="`max-height: ${maxHeight}`" tabindex="-1">
				<template
					v-for="(feature, j) in result.features.features"
					:key="`result-${i}-${j}`"
				>
					<!-- TODO: Add things to be done on keydown etc. -->
					<!-- TODO: Improve the type so relevant stuff is there -->
					<!-- 	@click="selectResult({ feature, categoryId })"
								@focus="focusIndex = `${index}-${innerDex}`"
								@blur="focusIndex = ''" -->
					<!-- eslint-disable vue/no-v-html -->
					<li
						:id="`polar-plugin-address-search-results-feature-${i}-${j}`"
						tabindex="-1"
						@keydown.down.prevent.stop="
							(event) => focusNextElement(true, event)
						"
						@keydown.up.prevent.stop="(event) => focusNextElement(false, event)"
						@keydown.escape.prevent.stop="escapeResults"
						v-html="strongTitleByInput(feature.title, inputValue)"
					/>
					<!-- eslint-enable vue/no-v-html -->
					<!-- TODO: Add afterResultComponent, if configured -->
					<!-- TODO: Implement button that expands the results -->
					<!-- TODO: Add divider -->
				</template>
			</ul>
		</template>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useAddressSearchStore } from '../store'
import { PluginId, type SearchResult } from '../types'
import { focusFirstResult } from '../utils/focusFirstResult'
import { strongTitleByInput } from '../utils/strongTitleByInput'
import { useCoreStore } from '@/core/stores/export'

const coreStore = useCoreStore()
const addressSearchStore = useAddressSearchStore()
const { inputValue, featuresAvailable, searchResults } =
	storeToRefs(addressSearchStore)

// const openCategories = ref<string[]>([])
const maxHeight = computed(() =>
	coreStore.hasWindowSize
		? 'inherit'
		: `calc(${coreStore.clientHeight}px - 5.75em)`
)

function escapeResults() {
	addressSearchStore.clear()
	;(coreStore.shadowRoot as ShadowRoot)
		.getElementById('polar-plugin-address-search-input')
		?.focus()
}

function focusNextElement(down: boolean, event: KeyboardEvent): void {
	const focus = ['BUTTON', 'LI']
	const sibling = down ? 'nextElementSibling' : 'previousElementSibling'
	const { target } = event

	if (target === null) {
		console.warn('Could not focus any element.')
		return
	}

	let searchBase = target as Element
	let candidateElement = searchBase[sibling]

	while (candidateElement && !focus.includes(candidateElement.tagName)) {
		candidateElement = candidateElement[sibling]

		if (!candidateElement) {
			const children = searchBase.parentElement?.[sibling]?.children
			if (children) {
				searchBase = children[down ? 0 : children.length - 1] as Element
				candidateElement = searchBase
			}
		}
	}

	if (candidateElement) {
		// @ts-expect-error | we have no non-HTML elements in this DOM part.
		candidateElement.focus()
		return
	}

	if (down) {
		focusFirstResult(
			(addressSearchStore.searchResults as SearchResult[]).length,
			coreStore.shadowRoot as ShadowRoot,
			event
		)
		return
	}

	;(coreStore.shadowRoot as ShadowRoot)
		.getElementById('polar-plugin-address-search-input')
		?.focus()
}
</script>

<style scoped>
.polar-plugin-address-search-result-wrapper {
	width: 100%;

	span {
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
		overflow-y: auto;

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

			&:first-of-type {
				margin-top: var(--kern-metric-space-small);
			}
		}
	}
}
</style>
