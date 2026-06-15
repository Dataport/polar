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

			<span> 3) Buttons </span>

			<span> 4) Details </span>
		</section>
	</PolarCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import PolarCard from '@/components/PolarCard.ce.vue'

import { useRoutingStore } from '../store.ts'
import { PluginId } from '../types'
import RoutingInput from './RoutingInput.ce.vue'
import RoutingOptions from './RoutingOptions.ce.vue'

const { route } = storeToRefs(useRoutingStore())
</script>
