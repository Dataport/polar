<template>
	<PolarIconButton
		:action="() => (fullscreenEnabled = !fullscreenEnabled)"
		:class="layout === 'standard' ? 'polar-plugin-fullscreen-standard' : ''"
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
import { useFullscreenStore } from '../store'
import { PluginId } from '../types'
import PolarIconButton from '@/components/PolarIconButton.ce.vue'
import { useCoreStore } from '@/core/stores/export.ts'

const { layout } = storeToRefs(useCoreStore())
const { fullscreenEnabled } = storeToRefs(useFullscreenStore())
</script>

<style scoped>
.polar-icon-button.polar-plugin-fullscreen-standard {
	position: absolute;
	right: 0;
	margin: 8px;
	pointer-events: all;
}
</style>
