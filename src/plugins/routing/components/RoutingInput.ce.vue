<template>
	<div class="polar-plugin-routing-route-wrapper">
		<div class="kern-form-input">
			<label class="kern-label" :for="`polar-plugin-routing-input-${index}`">
				{{ $t(($) => $.label[getRouteLabel(index)], { ns: PluginId }) }}
			</label>
			<input
				:id="`polar-plugin-routing-input-${index}`"
				v-model="inputValue"
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
				:features-available="featuresAvailable"
				:component-id="`routing-${index}`"
				:search-results="searchResults"
				:after-result-component="null"
				:limited-results="5"
				:input-value="inputValue"
				:result-count-label="resultCountLabel"
				:select-result="routeStore.selectResult"
				:toggle-label="toggleLabel"
				:selected-group-id="selectedGroupId"
				:focus-after-search="focusAfterSearch"
			/>
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
import { t } from 'i18next'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import KernButton from '@/components/kern/KernButton.ce.vue'
import PolarResultList from '@/components/PolarResultList.ce.vue'
import { useCoreStore } from '@/core/stores'
import { focusFirstResult } from '@/lib/focusFirstResult'

import { useRoutingStore } from '../store'
import { PluginId } from '../types'

const props = defineProps<{
	index: number
}>()

const routeStore = useRoutingStore()
const coreStore = useCoreStore()

const { currentlyFocusedInput, route, inputValue, showSearchResultList } =
	storeToRefs(routeStore)

const addressSearchStore = computed(() =>
	coreStore.getPluginStore('addressSearch')
)

const showResultList = computed(
	() =>
		showSearchResultList.value && currentlyFocusedInput.value === props.index
)

const selectedGroupId = computed(
	() => addressSearchStore.value?.selectedGroupId ?? 'defaultGroup'
)

const focusAfterSearch = computed(
	() => addressSearchStore.value?.focusAfterSearch ?? false
)

const searchResults = computed(
	() => addressSearchStore.value?.searchResults ?? []
)

/**
 * This makes sure that there are always two fillable input fields at max.
 */
const addWaypointButtonDisabled = computed(
	() =>
		route.value.filter((part) => Boolean(part.length)).length <
		route.value.length - 1
)

const featuresAvailable = computed(
	() =>
		Array.isArray(searchResults.value) &&
		searchResults.value.length > 0 &&
		searchResults.value.some(
			({ features: { features } }) =>
				Array.isArray(features) && features.length > 0
		)
)

function focusResultList(event: KeyboardEvent) {
	if (!featuresAvailable.value || !Array.isArray(searchResults.value)) {
		return
	}

	focusFirstResult(
		searchResults.value.length,
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

function toggleLabel(expanded: boolean) {
	return t(($) => $.resultList[expanded ? 'reduce' : 'extend'], {
		ns: PluginId,
	})
}

function resultCountLabel(count: number) {
	return t(($) => $.resultCount, {
		count,
		ns: PluginId,
	})
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
</style>
