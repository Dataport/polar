<template>
	<div class="polar-ui">
		<component
			:is="layout"
			class="layout"
			:class="{ 'has-window-size': hasWindowSize }"
		/>
	</div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useMainStore } from '../stores/main.ts'
import NineLayout from './layouts/NineLayout.ce.vue'
import StandardLayout from './layouts/StandardLayout.ce.vue'

const { configuration, hasWindowSize } = storeToRefs(useMainStore())

const layout = computed(() => {
	const configuredLayout = configuration.value.layout

	if (!configuredLayout || configuredLayout === 'standard') {
		return StandardLayout
	}
	if (configuredLayout === 'nineRegions') {
		return NineLayout
	}
	return configuredLayout
})
</script>

<style lang="scss" scoped>
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

	.layout {
		max-width: 100%;

		&.has-window-size {
			max-height: 100%;
		}
	}
}
</style>
