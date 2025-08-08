<template>
	<button
		class="kern-btn kern-btn--primary"
		@click="fullscreenEnabled = !fullscreenEnabled"
	>
		<span
			:class="[
				'kern-icon',
				fullscreenEnabled
					? 'kern-icon--fullscreen-exit'
					: 'kern-icon--fullscreen',
			]"
			aria-hidden="true"
		/>
		<span class="kern-label kern-sr-only">Vollbildmodus</span>
	</button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useFullscreenStore } from '../store'
const { fullscreenEnabled } = storeToRefs(useFullscreenStore())
</script>
