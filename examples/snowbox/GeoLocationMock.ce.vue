<template>
	<button
		class="kern-btn kern-btn--secondary mock-button"
		@click="clicked = !clicked"
	>
		<span class="kern-icon" :class="icon" aria-hidden="true" />
		<span class="kern-label kern-sr-only"> Locate me </span>
	</button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const clicked = ref(false)
const icon = computed(() =>
	clicked.value ? 'kern-icon-fill--near-me' : 'kern-icon--near-me'
)
</script>

<style scoped>
.kern-btn {
	background: var(--kern-color-layout-background-default);
	box-shadow:
		0 1px 1px 0 rgba(53, 57, 86, 0.16),
		0 1px 2px 0 rgba(53, 57, 86, 0.25),
		0 1px 6px 0 rgba(110, 117, 151, 0.25);
	border: none;
	pointer-events: all;

	&:focus,
	&:hover {
		background: var(--kern-color-layout-background-default);
		border: solid var(--kern-color-action-on-default);
		outline: solid var(--kern-color-action-default);
	}
}
</style>
