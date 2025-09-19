<template>
	<PolarIconButton
		:class="buttonClass"
		hint="button.label"
		:hint-options="{ context: fullscreenEnabled ? 'off' : 'on' }"
		:hint-namespace="PluginId"
		:icon="
			fullscreenEnabled ? 'kern-icon--fullscreen-exit' : 'kern-icon--fullscreen'
		"
		tooltip-position="left"
		@click="() => (fullscreenEnabled = !fullscreenEnabled)"
	/>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useFullscreenStore } from '../store'
import { PluginId } from '../types'
import PolarIconButton from '@/components/PolarIconButton.ce.vue'
import { useCoreStore } from '@/core/stores/export'

const coreStore = useCoreStore()
const fullscreenStore = useFullscreenStore()
const { fullscreenEnabled } = storeToRefs(fullscreenStore)

const buttonClass = computed(() =>
	coreStore.layout === 'standard'
		? 'polar-plugin-fullscreen-standard'
		: fullscreenStore.renderType === 'iconMenu'
			? ''
			: 'polar-plugin-fullscreen-nine-regions'
)
</script>

<style scoped>
.polar-icon-button.polar-plugin-fullscreen-standard {
	position: absolute;
	right: 0;
	margin: 0.5rem;
	pointer-events: all;
}
.polar-icon-button.polar-plugin-fullscreen-nine-regions {
	margin: 0.5rem;
}
</style>
