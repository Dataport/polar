<template>
	<div class="polar-ui" :class="{ 'polar-shadow': !hasWindowSize }">
		<component :is="layout" />
	</div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useMainStore } from '../stores/main'
import NineLayout from './layouts/NineLayout.ce.vue'
import StandardLayout from './layouts/StandardLayout.ce.vue'

const mainStore = useMainStore()
const { hasWindowSize } = storeToRefs(mainStore)

const layout = computed(() => {
	if (mainStore.layout === 'standard') {
		return StandardLayout
	}
	if (mainStore.layout === 'nineRegions') {
		return NineLayout
	}
	return mainStore.layout
})
</script>

<style scoped>
.polar-ui {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	pointer-events: none;

	width: 100%;
	height: 100%;

	& > * {
		pointer-events: all;
	}
}

.polar-shadow {
	&::before {
		content: '';
		position: absolute;
		box-shadow:
			inset 0 1px 1px 0 rgba(53, 57, 86, 0.5),
			inset 0 1px 2px 0 rgba(53, 57, 86, 0.5),
			inset 0 1px 6px 0 rgba(110, 117, 151, 0.5);
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		z-index: 1;
		border-radius: var(--kern-metric-border-radius-large);
		pointer-events: none;
	}
}
</style>
