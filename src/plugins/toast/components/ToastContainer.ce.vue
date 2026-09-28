<template>
	<div v-if="layout === 'standard'" class="polar-plugin-toast-standard-layout">
		<ToastUI />
	</div>
	<ToastUI v-else />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useCoreStore } from '@/core/stores'

import ToastUI from './ToastUI.ce.vue'

const { layout } = storeToRefs(useCoreStore())
</script>

<style scoped>
.polar-plugin-toast-standard-layout {
	position: absolute;
	z-index: 40;
	top: 0;
	left: var(--kern-metric-space-small);
	right: var(--kern-metric-space-small);

	@media (min-width: 50em) {
		left: 25%;
		right: 25%;
	}
}
</style>
