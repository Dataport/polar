<template>
	<PolarCard v-if="!coreStore.hasSmallDisplay">
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
			<RoutingDetails />
		</section>
	</PolarCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import KernButton from '@/components/kern/KernButton.vue'
import PolarCard from '@/components/PolarCard.vue'
import { useCoreStore } from '@/core/stores'

import { useRoutingStore } from '../store'
import { PluginId } from '../types'
import RoutingDetails from './RoutingDetails.vue'
import RoutingInput from './RoutingInput.vue'
import RoutingOptions from './RoutingOptions.vue'

const coreStore = useCoreStore()
const routingStore = useRoutingStore()
const { route } = storeToRefs(routingStore)
</script>

<style scoped>
hr {
	width: 100%;
}
</style>
