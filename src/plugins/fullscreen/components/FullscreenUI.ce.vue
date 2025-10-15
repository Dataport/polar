<template>
	<PolarIconButton
		:class="layout === 'standard' ? 'polar-plugin-fullscreen-standard' : ''"
		:hint="
			$t(($) => $.button.label, {
				ns: PluginId,
				context: fullscreenEnabled ? 'off' : 'on',
			})
		"
		:icon="
			fullscreenEnabled ? 'kern-icon--fullscreen-exit' : 'kern-icon--fullscreen'
		"
		tooltip-position="left"
		@click="() => (fullscreenEnabled = !fullscreenEnabled)"
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
	box-shadow: none;
}
</style>
