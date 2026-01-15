<template>
	<PolarIconButton
		:class="buttonClass"
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
import { computed } from 'vue'

import PolarIconButton from '@/components/PolarIconButton.ce.vue'
import { useCoreStore } from '@/core/stores'

import { useFullscreenStore } from '../store'
import { PluginId } from '../types'

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
	box-shadow: none;
}
.polar-icon-button.polar-plugin-fullscreen-nine-regions {
	margin: 0.5rem;
}
</style>
