<template>
	<div class="polar-ui">
		<component :is="layout" />
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { useMainStore } from '../stores/main'
import NineLayout from './layouts/NineLayout.ce.vue'
import StandardLayout from './layouts/StandardLayout.ce.vue'

const mainStore = useMainStore()

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
}
</style>
