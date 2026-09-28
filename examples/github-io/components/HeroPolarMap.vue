<template>
	<div class="lp-hero__map-container" :aria-busy="isLoading">
		<p v-if="isLoading" class="lp-hero__map-status" role="status">
			Loading interactive map...
		</p>
		<p v-else-if="errorMessage" class="lp-hero__map-status" role="alert">
			{{ errorMessage }}
		</p>
		<div id="hero-polar-map" aria-label="Interactive POLAR map demo" />
	</div>
</template>

<script setup lang="ts">
import { addPlugins } from '@polar/polar'
import { createMap } from '@polar/polar/client'
import Attributions from '@polar/polar/plugins/attributions'
import Scale from '@polar/polar/plugins/scale'
import { onMounted, onUnmounted, ref } from 'vue'

import {
	heroMapConfiguration,
	heroMapContainerId,
	heroMapServiceRegisterUrl,
} from './heroMapConfiguration'

const isLoading = ref(true)
const errorMessage = ref('')
let isUnmounted = false

onMounted(async () => {
	try {
		const map = await createMap(
			heroMapContainerId,
			heroMapServiceRegisterUrl,
			heroMapConfiguration
		)
		map.store.removePlugin('scale')
		addPlugins(map, [
			Attributions({
				displayComponent: true,
				layoutTag: 'BOTTOM_RIGHT',
				...heroMapConfiguration.attributions,
			}),
			Scale({
				displayComponent: true,
				layoutTag: 'BOTTOM_RIGHT',
				...heroMapConfiguration.scale,
			}),
		])
		if (isUnmounted) {
			return
		}
		isLoading.value = false
	} catch {
		if (!isUnmounted) {
			isLoading.value = false
			errorMessage.value = 'The interactive map is currently unavailable.'
		}
	}
})

onUnmounted(() => {
	isUnmounted = true
})
</script>

<style scoped>
.lp-hero__map-container {
	position: relative;
	width: 100%;
	height: 480px;
}

.lp-hero__map-status {
	position: absolute;
	inset: 1rem;
	display: grid;
	place-items: center;
	margin: 0;
	color: var(--kern-color-layout-text-muted);
}
</style>
