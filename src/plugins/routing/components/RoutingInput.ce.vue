<template>
	<div class="polar-plugin-routing-route-wrapper">
		<div class="kern-form-input">
			<label class="kern-label" :for="`polar-plugin-routing-input-${index}`">
				{{ $t(($) => $.label[getRouteLabel(index)], { ns: PluginId }) }}
			</label>
			<input
				:id="`polar-plugin-routing-input-${index}`"
				v-model="routeInputValue"
				class="kern-form-input__input"
				:aria-label="
					$t(($) => $.label.aria, {
						ns: PluginId,
						position: $t(($) => $.label[getRouteLabel(index)], {
							ns: PluginId,
						}),
					})
				"
				@focus="currentlyFocusedInput = index"
				@keydown.down.prevent.stop="focusResultList"
			/>
			<PolarResultList
				v-if="showResultList"
				class="polar-plugin-routing-result-list"
				style="box-shadow: var(--polar-shadow)"
				:component-id="`routing-${index}`"
				:search-results="searchResultsForInput"
				:limited-results="5"
				:input-value="routeInputValue"
				:selected-group-id="selectedSearchGroupId"
				:focus-after-search="focusAfterSearch"
				:focus-return-target-id="`polar-plugin-routing-input-${index}`"
				:result-item-id-prefix="`polar-result-list-routing-${index}-results-feature`"
				@select-result="routeStore.selectResult"
			>
				<template #result-count-label="{ count }">
					{{ $t(($) => $.resultCount, { count, ns: PluginId }) }}
				</template>
				<template #toggle-label="{ expanded }">
					{{
						$t(($) => $.resultList[expanded ? 'reduce' : 'extend'], {
							ns: PluginId,
						})
					}}
				</template>
			</PolarResultList>
		</div>
		<div class="polar-plugin-routing-waypoint-button-wrapper">
			<KernButton
				icon="kern-icon--add"
				:label-sr-only="true"
				class="kern-btn--tertiary"
				:disabled="addWaypointButtonDisabled"
				@click="routeStore.setRoute(index)"
			>
				{{ $t(($) => $.label.add, { ns: PluginId }) }}
			</KernButton>
			<KernButton
				icon="kern-icon--remove"
				:label-sr-only="true"
				class="kern-btn--tertiary"
				:disabled="route.length === 2"
				@click="routeStore.setRoute(index, true)"
			>
				{{ $t(($) => $.label.remove, { ns: PluginId }) }}
			</KernButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Coordinate } from 'ol/coordinate'
import type { StoreGeneric } from 'pinia'
import type { SearchResult } from '@/core'

import { computed } from 'vue'

import KernButton from '@/components/kern/KernButton.ce.vue'
import PolarResultList from '@/components/PolarResultList.ce.vue'
import { useCoreStore } from '@/core/stores'
import { focusFirstResult } from '@/lib/focusFirstResult'
import SearchResultSymbols from '@/lib/searchResultSymbols'

import { useRoutingStore } from '../store'
import { PluginId } from '../types'

const props = defineProps<{
	index: number
}>()

const routeStore: StoreGeneric = useRoutingStore()
const coreStore = useCoreStore()

const currentlyFocusedInput = computed({
	get: () => routeStore.currentlyFocusedInput as number,
	set: (value: number) => {
		routeStore.currentlyFocusedInput = value
	},
})
const route = computed(() => routeStore.route as Coordinate[])
const routeInputValues = computed(() => routeStore.routeInputValues as string[])
const routeSearchResults = computed(
	() => routeStore.routeSearchResults as (SearchResult[] | symbol)[]
)
const showSearchResultList = computed(() =>
	Boolean(routeStore.showSearchResultList)
)
const selectedSearchGroupId = computed(
	() => routeStore.selectedSearchGroupId as string
)
const focusAfterSearch = computed(() => Boolean(routeStore.focusAfterSearch))

const routeInputValue = computed({
	get: () => {
		if (!showSearchResultList.value) {
			const coordinate = route.value[props.index]
			if (Array.isArray(coordinate) && coordinate.length) {
				return coordinate.join(',')
			}
		}
		return routeInputValues.value[props.index] ?? ''
	},
	set: (value: string) => {
		routeStore.setRouteInputValue(props.index, value)
	},
})

const searchResultsForInput = computed(
	() => routeSearchResults.value[props.index] ?? SearchResultSymbols.NO_SEARCH
)

const showResultList = computed(
	() =>
		showSearchResultList.value && currentlyFocusedInput.value === props.index
)

/**
 * This makes sure that there are always two fillable input fields at max.
 */
const addWaypointButtonDisabled = computed(
	() =>
		route.value.filter((part) => Boolean(part.length)).length <
		route.value.length - 1
)

function focusResultList(event: KeyboardEvent) {
	if (!Array.isArray(searchResultsForInput.value)) {
		return
	}

	focusFirstResult(
		searchResultsForInput.value.length,
		coreStore.shadowRoot as ShadowRoot,
		`polar-result-list-routing-${props.index}-results-feature`,
		event
	)
}

const routeInput = computed(() =>
	route.value.map((coord, i) => {
		const label = routeAddressTexts.value[i]
		return label?.length ? label : coord.join(', ')
	})
)

function getRouteLabel(index: number) {
	return index === 0
		? 'start'
		: index === route.value.length - 1
			? 'end'
			: 'middle'
}
</script>

<style scoped>
.polar-plugin-routing-route-wrapper {
	display: flex;
	align-items: end;
	gap: var(--kern-metric-space-default);

	.polar-plugin-routing-waypoint-button-wrapper {
		display: flex;
		gap: var(--kern-metric-space-small);
	}
}

.polar-plugin-routing-route-wrapper
	:deep(.polar-plugin-routing-result-list ul li) {
	align-items: flex-start;
	padding-top: var(--kern-metric-space-2x-small);
	padding-bottom: var(--kern-metric-space-2x-small);
	min-height: var(--kern-metric-dimension-x-large);
}

.polar-plugin-routing-route-wrapper
	:deep(.polar-plugin-routing-result-list ul li span[aria-hidden='true']) {
	white-space: normal;
	overflow-wrap: anywhere;
	word-break: break-word;
}
</style>
