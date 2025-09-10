<template>
	<PolarIconButton
		:action="() => (fullscreenEnabled = !fullscreenEnabled)"
		:button-class="buttonClass"
		hint="button.label"
		:hint-options="{ context: fullscreenEnabled ? 'off' : 'on' }"
		:hint-namespace="PluginId"
		:icon="
			fullscreenEnabled ? 'kern-icon--fullscreen-exit' : 'kern-icon--fullscreen'
		"
		tooltip-position="left"
	/>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useFullscreenStore } from '../store'
import { PluginId } from '../types'
import PolarIconButton from '@/components/PolarIconButton.ce.vue'
import { useCoreStore } from '@/core/stores/export.ts'

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

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style>
/* TODO: For some reason, these styles don't work scoped and with :deep. */
.polar-plugin-fullscreen-standard {
	position: absolute;
	right: 0;
	margin: 0.5rem;
	pointer-events: all;
}
.polar-plugin-fullscreen-nine-regions {
	margin: 0.5rem;
}
</style>
