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
import { createMap } from '@polar/polar/client'
import { onMounted, onUnmounted, ref } from 'vue'

import {
	heroMapConfiguration,
	heroMapContainerId,
	heroMapServiceRegisterUrl,
} from './heroMapConfiguration'

const isLoading = ref(true)
const errorMessage = ref('')
let isUnmounted = false
let mapElement: { remove: () => void } | undefined

onMounted(async () => {
	try {
		mapElement = await createMap(
			heroMapContainerId,
			heroMapServiceRegisterUrl,
			heroMapConfiguration
		)
		if (isUnmounted) {
			mapElement.remove()
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
	mapElement?.remove()
	mapElement = undefined
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
