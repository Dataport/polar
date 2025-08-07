<template>
	<button
		class="kern-btn kern-btn--primary"
		@click="store.fullscreenEnabled = !store.fullscreenEnabled"
	>
		<span
			:class="[
				'kern-icon',
				store.fullscreenEnabled
					? 'kern-icon--fullscreen-exit'
					: 'kern-icon--fullscreen',
			]"
			aria-hidden="true"
		/>
		<span class="kern-label kern-sr-only">Vollbildmodus</span>
	</button>
</template>

<script setup lang="ts">
import { useFullscreenStore } from '../store'
const store = useFullscreenStore()
</script>

<style lang="scss" scoped>
.kern-icon--fullscreen {
	mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='%231f1f1f'%3E%3Cpath d='M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z'/%3E%3C/svg%3E");
	background-color: var(--kern-color-layout-text-default, #171a2b);
}
.kern-icon--fullscreen-exit {
	mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='%231f1f1f'%3E%3Cpath d='M240-120v-120H120v-80h200v200h-80Zm400 0v-200h200v80H720v120h-80ZM120-640v-80h120v-120h80v200H120Zm520 0v-200h80v120h120v80H640Z'/%3E%3C/svg%3E");
	background-color: var(--kern-color-layout-text-default, #171a2b);
}
</style>
