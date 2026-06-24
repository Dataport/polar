<template>
	<PolarCard>
		<header class="kern-card__header">
			<h2 class="kern-title">{{ $t(($) => $.title, { ns: PluginId }) }}</h2>
		</header>
		<section class="kern-card__body">
			<RoutingInput
				v-for="(_, index) in route"
				:key="`polar-plugin-routing-route-wrapper-${index}`"
				:index="index"
			/>
			<RoutingOptions />
			<hr class="kern-divider" aria-hidden="true" />
			<div class="routing-button-wrapper">
				<KernButton class="kern-btn--secondary" @click="routingStore.reset">
					{{ $t(($) => $.label.reset, { ns: PluginId }) }}
				</KernButton>
				<KernButton
					class="kern-btn--primary"
					:disabled="routingResponseData === null"
					@click="showDetails = !showDetails"
				>
					{{ $t(($) => $.label.details, { ns: PluginId }) }}
				</KernButton>
			</div>
			<RoutingDetails />
		</section>
	</PolarCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import KernButton from '@/components/kern/KernButton.ce.vue'
import PolarCard from '@/components/PolarCard.ce.vue'

import { useRoutingStore } from '../store.ts'
import { PluginId } from '../types'
import RoutingDetails from './RoutingDetails.ce.vue'
import RoutingInput from './RoutingInput.ce.vue'
import RoutingOptions from './RoutingOptions.ce.vue'

const routingStore = useRoutingStore()
const { route, routingResponseData, showDetails } = storeToRefs(routingStore)
</script>

<style scoped>
hr {
	width: 100%;
}

.routing-button-wrapper {
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
	gap: var(--kern-metric-space-small);
	width: 100%;
}
</style>
