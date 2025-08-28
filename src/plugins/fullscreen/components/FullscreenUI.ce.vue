<template>
	<PolarIconButton
		:action="() => (fullscreenEnabled = !fullscreenEnabled)"
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
const { fullscreenEnabled } = storeToRefs(useFullscreenStore())
</script>
