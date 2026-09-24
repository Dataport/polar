<template>
	<PolarCard
		:class="{
			'has-hint': hint.length > 0,
			'polar-plugin-address-search-shown-results':
				Array.isArray(searchResults) && searchResults.length,
			'kern-card-standard': layout === 'standard',
		}"
		:style="`max-width: ${maxWidth}`"
	>
		<div class="polar-plugin-address-search-selection-wrapper">
			<!-- Mapping in template to guarantee update on language change-->
			<PolarSelect
				v-if="hasMultipleGroups"
				v-model="selectedGroupId"
				:label="$t(($) => $.groupSelector, { ns: PluginId })"
				:label-sr-only="true"
				:options="
					groupSelectOptions.map(({ groupId, text }) => ({
						value: groupId,
						label: $t(($) => $[text], { ns: PluginId }),
					}))
				"
			/>
			<PolarSearchInput
				:input-id="'polar-plugin-address-search-input'"
				:input-value="inputValue"
				:label-text="ariaLabel"
				:described-by-text="'polar-plugin-address-search-description'"
				:description-for-aria="descriptionForAria"
				:layout="layout"
				:is-loading="isLoading"
				:show-clear-button="showClearButton"
				:clear-label="$t(($) => $.hint.clear, { ns: PluginId })"
				:hint="hint"
				@update:input-value="(val) => (inputValue = val)"
				@clear="clear"
				@keydown.enter="addressSearchStore.abortAndRequest"
				@keydown.down="inputDown"
			/>
		</div>
		<SearchResults />
	</PolarCard>
</template>

<script setup lang="ts">
import { t } from 'i18next'
import { storeToRefs } from 'pinia'
import { computed, nextTick } from 'vue'

import PolarCard from '@/components/PolarCard.ce.vue'
import PolarSearchInput from '@/components/PolarSearchInput.ce.vue'
import PolarSelect from '@/components/PolarSelect.ce.vue'
import { useCoreStore } from '@/core/stores'
import { focusFirstResult } from '@/lib/focusFirstResult'

import { useAddressSearchStore } from '../store'
import { PluginId } from '../types'
import SearchResults from './SearchResults.ce.vue'

const coreStore = useCoreStore()
const addressSearchStore = useAddressSearchStore()
const { layout } = storeToRefs(coreStore)
const {
	groupSelectOptions,
	hasMultipleGroups,
	hint,
	inputValue,
	isLoading,
	searchResults,
	selectedGroupId,
} = storeToRefs(addressSearchStore)

const ariaLabel = computed(() =>
	t(
		($) =>
			$[
				groupSelectOptions.value.find(
					({ groupId }) => groupId === selectedGroupId.value
				)?.text || 'defaultLabel'
			],
		{ ns: PluginId }
	)
)
const maxWidth = computed(() => `${coreStore.clientWidth * 0.75}px`)

const descriptionForAria = computed(() =>
	t(($) => $.aria.description, { ns: PluginId })
)

const showClearButton = computed(
	() => inputValue.value.length > 0 && !isLoading.value
)

function clear() {
	addressSearchStore.clear()
	void nextTick(() => {
		;(
			coreStore.shadowRoot?.getElementById(
				`polar-plugin-address-search-input`
			) as HTMLElement
		).focus()
	})
}

function inputDown(event: KeyboardEvent) {
	if (Array.isArray(addressSearchStore.searchResults)) {
		focusFirstResult(
			addressSearchStore.searchResults.length,
			coreStore.shadowRoot as ShadowRoot,
			'polar-result-list-address-search-results-feature',
			event
		)
	}
}
</script>

<style scoped>
#polar-plugin-address-search-icon-button {
	position: absolute;
	margin: var(--kern-metric-space-small);
}

.kern-card.polar-plugin-address-search-shown-results
	:deep(.kern-card__container) {
	padding-bottom: 0;
}

.kern-card.has-hint :deep(.kern-card__container) {
	padding-bottom: var(--kern-metric-space-small);
}

.kern-card.kern-card-standard {
	position: absolute;
	min-width: inherit;
	z-index: 2;
}

.kern-card {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: var(--kern-metric-space-small);
	max-height: calc(
		calc(100% - var(--kern-metric-dimension-large)) -
			calc(2 * var(--kern-metric-space-small))
	);
	width: 25rem;
	min-width: inherit;
	z-index: 1;

	&:deep(.kern-card__container) {
		flex: 0 1 auto;
		overflow-y: auto;
	}

	.polar-plugin-address-search-selection-wrapper {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		gap: var(--kern-metric-space-small);

		&:deep(select) {
			width: 0;
		}
	}
}
</style>
