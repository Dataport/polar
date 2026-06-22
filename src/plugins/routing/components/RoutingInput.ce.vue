<template>
	<div class="polar-plugin-routing-route-wrapper">
		<div class="kern-form-input">
			<label class="kern-label" for="text">
				{{ $t(($) => $.label[getRouteLabel(index)], { ns: PluginId }) }}
			</label>
			<input
				:id="`polar-plugin-routing-input-${index}`"
				v-model="route[index]"
				class="kern-form-input__input"
				:aria-label="
					$t(($) => $.label.aria, {
						ns: PluginId,
						position: $t(($) => $.label[getRouteLabel(index)], {
							ns: PluginId,
						}),
					})
				"
				@focus="(e) => focusInput(e, index)"
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
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import KernButton from '@/components/kern/KernButton.ce.vue'
import { useCoreStore } from '@/core/stores'

import { useRoutingStore } from '../store.ts'
import { PluginId } from '../types'

defineProps<{
	index: number
}>()

const coreStore = useCoreStore()
const routeStore = useRoutingStore()

const { route } = storeToRefs(routeStore)

// TODO(dopenguin): Add TSDoc
const addWaypointButtonDisabled = computed(() => {
	return (
		route.value.filter((part) => Boolean(part.length)).length <
		route.value.length - 1
	)
})

function focusInput(e: FocusEvent, index: number) {
	if (routeStore.currentlyFocusedInput !== -1) {
		;(coreStore.shadowRoot as ShadowRoot)
			.getElementById(
				`polar-plugin-routing-input-${routeStore.currentlyFocusedInput}`
			)
			?.classList.remove('polar-plugin-routing-input-focused')
	}
	;(e.currentTarget as HTMLElement).classList.add(
		'polar-plugin-routing-input-focused'
	)
	routeStore.currentlyFocusedInput = index
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

	/* TODO(dopenguin): Solve this later */
	.kern-form-input__input {
		border-top: medium solid transparent;
		border-right: medium solid transparent;
		border-left: medium solid transparent;
	}
	.polar-plugin-routing-input-focused {
		border: solid var(--kern-color-action-default);
	}

	.polar-plugin-routing-waypoint-button-wrapper {
		display: flex;
		gap: var(--kern-metric-space-small);
	}
}
</style>
