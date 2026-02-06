<template>
	<PolarIconButton
		v-if="showButton"
		id="polar-plugin-address-search-icon-button"
		:hint="$t(($) => $.hint.button, { ns: PluginId })"
		icon="kern-icon--search"
		@click="updateStatus"
	/>
	<PolarCard
		v-else
		:class="{
			'has-hint': hint.length > 0,
			'polar-plugin-address-search-shown-results':
				Array.isArray(searchResults) && searchResults.length,
		}"
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
				<input
					id="polar-plugin-address-search-input"
					v-model="inputValue"
					class="kern-form-input__input"
					type="text"
					:aria-label="
						hint.length > 0 ? hint : $t(($) => $.aria.label, { ns: PluginId })
					"
					:aria-description="
						hint.length > 0
							? hint
							: $t(($) => $.aria.description, { ns: PluginId })
					"
					@keydown.enter="addressSearchStore.abortAndRequest"
					@keydown.down.prevent.stop="inputDown"
					@focusout="updateStatus"
				/>
				<!-- TODO: May be replaced with the KERN-Loader. -->
				<SmallLoader v-if="isLoading" />
				<button
					v-if="inputValue.length"
					class="kern-btn kern-btn--tertiary polar-plugin-address-search-input-button"
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
import { storeToRefs } from 'pinia'
import { computed, nextTick, ref } from 'vue'

import PolarCard from '@/components/PolarCard.ce.vue'
import PolarIconButton from '@/components/PolarIconButton.ce.vue'
import PolarSelect from '@/components/PolarSelect.ce.vue'
import { useCoreStore } from '@/core/stores'

import { useAddressSearchStore } from '../store'
import { PluginId } from '../types'
import { focusFirstResult } from '../utils/focusFirstResult'
import SearchResults from './SearchResults.ce.vue'
import SmallLoader from './SmallLoader.ce.vue'

const coreStore = useCoreStore()
const addressSearchStore = useAddressSearchStore()
const {
	groupSelectOptions,
	hasMultipleGroups,
	hint,
	inputValue,
	isLoading,
	searchResults,
	selectedGroupId,
} = storeToRefs(addressSearchStore)

const open = ref(false)

const showButton = computed(
	() => (coreStore.hasSmallDisplay || !coreStore.hasWindowSize) && !open.value
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

function updateStatus() {
	// TODO: Find a possible different solution for multiple groups instead of just disabling this feature
	if (!open.value || (!inputValue.value.length && !hasMultipleGroups.value)) {
		open.value = !open.value
		if (open.value) {
			void nextTick(() => {
				;(
					coreStore.shadowRoot?.getElementById(
						`polar-plugin-address-search-input`
					) as HTMLElement
				).focus()
			})
		}
	}
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

.kern-card {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: var(--kern-metric-space-small);
	position: absolute;
	margin: var(--kern-metric-space-small);
	max-height: calc(
		calc(100% - var(--kern-metric-dimension-large)) -
			calc(2 * var(--kern-metric-space-small))
	);

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

		.polar-plugin-address-search-input-wrapper {
			display: flex;
			flex-direction: column;
			width: 100%;

			#polar-plugin-address-search-input {
				border-radius: var(--kern-metric-border-radius-small);
				background: var(--kern-color-form-input-background);
				padding-right: calc(var(--kern-metric-space-x-large) * 3);
			}

			.polar-plugin-address-search-input-button {
				position: absolute;
				right: 0;
				border-radius: var(--kern-metric-border-radius-small);
				margin: var(--kern-metric-space-small);
				margin-right: var(--kern-metric-space-default);
				width: var(--kern-metric-dimension-large);
				min-height: var(--kern-metric-dimension-large);
			}

			.polar-plugin-address-search-hint {
				color: var(--kern-color-layout-text-muted);
				font-size: calc(var(--kern-typography-font-size-static-small) * 0.875);
				padding: 0 var(--kern-metric-space-2x-small);
				margin-top: var(--kern-metric-space-small);
			}

			.kern-loader {
				position: absolute;
				right: calc(var(--kern-metric-space-x-large) * 1.5);
			}
		}
	}
}
</style>
