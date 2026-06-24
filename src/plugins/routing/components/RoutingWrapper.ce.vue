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
			<KernButton
				class="kern-btn--secondary kern-btn--block"
				@click="routingStore.reset"
			>
				{{ $t(($) => $.label.reset, { ns: PluginId }) }}
			</KernButton>
			<hr v-if="showDetails" class="kern-divider" aria-hidden="true" />
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
const { route, showDetails } = storeToRefs(routingStore)
</script>

<style scoped>
hr {
	width: 100%;
}
</style>
