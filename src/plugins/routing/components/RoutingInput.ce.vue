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
				style="box-shadow: var(--polar-shadow)"
				:component-id="`routing-${index}`"
				:search-results="searchResultsForInput"
				:limited-results="limitedResults"
				:input-value="routeInputValue"
				:selected-group-id="selectedSearchGroupId"
				:focus-after-search="focusAfterSearch"
				:focus-return-target-id="`polar-plugin-routing-input-${index}`"
				:result-item-id-prefix="`polar-result-list-routing-${index}-results-feature`"
				@select-result="selectResult"
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
			<p v-if="searchResultHint" class="polar-plugin-routing-search-hint">
				{{ searchResultHint }}
			</p>
		</div>
		<div class="polar-plugin-routing-waypoint-button-wrapper">
			<KernButton
				icon="kern-icon--add"
				:label-sr-only="true"
				class="kern-btn--tertiary"
				:disabled="addWaypointButtonDisabled"
				@click="setRoute(index)"
			>
				{{ $t(($) => $.label.add, { ns: PluginId }) }}
			</KernButton>
			<KernButton
				icon="kern-icon--remove"
				:label-sr-only="true"
				class="kern-btn--tertiary"
				:disabled="route.length === 2"
				@click="setRoute(index, true)"
			>
				{{ $t(($) => $.label.remove, { ns: PluginId }) }}
			</KernButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
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

const routeStore = useRoutingStore()
const coreStore = useCoreStore()

const limitedResults = computed(
	() => coreStore.getPluginStore('addressSearch')?.limitResults ?? 5
)

const currentlyFocusedInput = computed({
	get: () => routeStore.currentlyFocusedInput,
	set: (value: number) => {
		routeStore.currentlyFocusedInput = value
	},
})

const {
	route,
	routeInputValues,
	routeSearchResults,
	routeAddressTexts,
	showSearchResultList,
	selectedSearchGroupId,
	focusAfterSearch,
	searchResultHint,
} = storeToRefs(routeStore)

const routeInputValue = computed({
	get: () => {
		const typedValue = routeInputValues.value[props.index] ?? ''
		if (typedValue.length > 0) {
			return typedValue
		}

		const addressText = routeAddressTexts.value[props.index]
		if (addressText && addressText.length > 0) {
			return addressText
		}

		const coordinate = route.value[props.index]
		if (!showSearchResultList.value && Array.isArray(coordinate)) {
			return coordinate.length ? coordinate.join(',') : ''
		}

		return ''
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

const { setRoute, selectResult } = routeStore

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

	.polar-plugin-routing-search-hint {
		color: var(--kern-color-layout-text-muted);
	}
}
</style>
