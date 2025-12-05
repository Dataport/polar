<template>
	<PolarIconButton
		v-if="showButton"
		id="polar-plugin-address-search-icon-button"
		:hint="$t(($) => $.hint.button, { ns: PluginId })"
		icon="kern-icon--search"
		@click="updateStatus"
	/>
	<PolarCard v-else>
		<!--
				TODO:
					- Add aria-description
					- Add label
					- Add placeholder
					- Show inline-loader
					- Focus first result on arrow-down
			-->
		<!-- TODO: Using the arrow keys move the map instead of getting to the next character -->
		<input
			id="polar-plugin-address-search-input"
			v-model="inputValue"
			class="kern-form-input__input"
			type="text"
			@keydown.enter="addressSearchStore.abortAndRequest"
			@keydown.down.prevent.stop="inputDown"
			@focusout="updateStatus"
		/>
		<!-- TODO: Show a loader inline here while requests are sent -->
		<button
			class="kern-btn kern-btn--tertiary polar-plugin-address-search-input-button"
			@click="addressSearchStore.clear"
		>
			<span class="kern-icon kern-icon--close" aria-hidden="true" />
			<span class="kern-label kern-sr-only">
				{{ $t(($) => $.hint.clear, { ns: PluginId }) }}
			</span>
		</button>
		<NineRegionsResults />
	</PolarCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, nextTick, ref } from 'vue'
import { useAddressSearchStore } from '../store'
import { PluginId } from '../types'
import { focusFirstResult } from '../utils/focusFirstResult'
import NineRegionsResults from './NineRegionsResults.ce.vue'
import PolarCard from '@/components/PolarCard.ce.vue'
import PolarIconButton from '@/components/PolarIconButton.ce.vue'
import { useCoreStore } from '@/core/stores/export'

// TODO: Add information below input field for error
// TODO: Show results from separate groups not visually divided. They should be distinguishable by an icon and an (Aria-)label

const coreStore = useCoreStore()
const addressSearchStore = useAddressSearchStore()
const { inputValue } = storeToRefs(addressSearchStore)

const open = ref(false)

const showButton = computed(
	() => (coreStore.hasSmallDisplay || !coreStore.hasWindowSize) && !open.value
)

function updateStatus() {
	if (!open.value || !inputValue.value.length) {
		open.value = !open.value
		void nextTick(() => {
			;(
				coreStore.shadowRoot?.getElementById(
					`polar-plugin-address-search-${open.value ? 'input' : 'icon-button'}`
				) as HTMLElement
			).focus()
		})
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
	margin: 0.5rem;
}

.kern-card {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 0.5rem;

	position: absolute;
	margin: 0.5rem;

	#polar-plugin-address-search-input {
		pointer-events: all;
		border-radius: var(--kern-metric-border-radius-small);
		background: var(--kern-color-form-input-background);
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
}
</style>
