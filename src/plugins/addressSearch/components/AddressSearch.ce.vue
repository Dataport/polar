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
				:aria-label="$t(($) => $.groupSelector, { ns: PluginId })"
				:options="
					groupSelectOptions.map(({ groupId, text }) => ({
						value: groupId,
						label: $t(($) => $[text], { ns: PluginId }),
					}))
				"
				:value="selectedGroupId"
				@update:value="selectedGroupId = $event as string"
			/>
			<div class="polar-plugin-address-search-input-wrapper">
				<span class="kern-icon kern-icon--search" aria-hidden="true" />
				<input
					id="polar-plugin-address-search-input"
					v-model="inputValue"
					class="kern-form-input__input"
					type="text"
					:aria-label="ariaLabel"
					:aria-description="
						hint.length > 0
							? hint
							: $t(($) => $.aria.description, { ns: PluginId })
					"
					@keydown.enter="addressSearchStore.abortAndRequest"
					@keydown.down.prevent.stop="inputDown"
				/>
				<SmallLoader
					v-if="isLoading"
					:style="`right: ${slotPlacement}; top: ${slotPlacement}`"
				/>
				<button
					v-if="inputValue.length && !isLoading"
					class="kern-btn kern-btn--tertiary polar-plugin-address-search-input-button"
					:style="`right: ${slotPlacement}; top: ${slotPlacement}`"
					@click="clear"
				>
					<span class="kern-icon kern-icon--close" aria-hidden="true" />
					<span class="kern-label kern-sr-only">
						{{ $t(($) => $.hint.clear, { ns: PluginId }) }}
					</span>
				</button>
				<!-- TODO: Displaying this when multipleGroups are being used jiggles a bit -->
				<span v-if="hint.length > 0" class="polar-plugin-address-search-hint">
					{{ hint }}
				</span>
			</div>
		</div>
		<SearchResults />
	</PolarCard>
</template>

<script setup lang="ts">
import { t } from 'i18next'
import { storeToRefs } from 'pinia'
import { computed, nextTick } from 'vue'

import PolarCard from '@/components/PolarCard.ce.vue'
import PolarSelect from '@/components/PolarSelect.ce.vue'
import { useCoreStore } from '@/core/stores'

import { useAddressSearchStore } from '../store'
import { PluginId } from '../types'
import { focusFirstResult } from '../utils/focusFirstResult'
import SearchResults from './SearchResults.ce.vue'
import SmallLoader from './SmallLoader.ce.vue'

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
	hint.value.length > 0
		? hint.value
		: t(
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
const slotPlacement = computed(() =>
	layout.value === 'standard' ? '0' : 'var(--kern-metric-space-small)'
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
	margin: var(--kern-metric-space-small);
	max-height: calc(
		calc(100% - var(--kern-metric-dimension-large)) -
			calc(2 * var(--kern-metric-space-small))
	);
	width: 25rem;
	min-width: inherit;

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

		.polar-plugin-address-search-input-wrapper {
			display: grid;
			grid-template-columns: auto minmax(0, 1fr);
			grid-template-rows: auto auto;
			align-items: center;
			width: 100%;
			column-gap: var(--kern-metric-space-small);

			.kern-icon--search {
				grid-column: 1;
				grid-row: 1;
				width: var(--kern-metric-dimension-large);
				height: var(--kern-metric-dimension-large);
			}

			#polar-plugin-address-search-input {
				grid-column: 2;
				grid-row: 1;
				border-radius: var(--kern-metric-border-radius-small);
				background: var(--kern-color-form-input-background);
				padding-right: calc(var(--kern-metric-space-large) * 2);
			}

			.polar-plugin-address-search-input-button {
				position: absolute;
				right: 0;
				top: 0;
				border-radius: var(--kern-metric-border-radius-small);
				margin: var(--kern-metric-space-default);
				width: var(--kern-metric-dimension-large);
				min-height: var(--kern-metric-dimension-large);
			}

			.kern-loader {
				position: absolute;
				right: 0;
				top: 0;
				margin: var(--kern-metric-space-default);
			}

			.polar-plugin-address-search-hint {
				grid-column: 2;
				grid-row: 2;
				color: var(--kern-color-layout-text-muted);
				font-size: calc(var(--kern-typography-font-size-static-small) * 0.875);
				padding: 0 var(--kern-metric-space-2x-small);
				margin-top: var(--kern-metric-space-small);
			}
		}
	}
}
</style>
