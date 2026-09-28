<template>
	<PolarIconButton
		:hint="$t(($) => $.label.return, { ns: PluginId })"
		icon="kern-icon--home"
		:tooltip-position="initialViewStore.tooltipPosition"
		@click="initialViewStore.returnToInitialView()"
	/>
</template>

<script setup lang="ts">
import PolarIconButton from '@/components/PolarIconButton.ce.vue'

import { useInitialViewStore } from '../store'
import { PluginId } from '../types'

const initialViewStore = useInitialViewStore()
</script>
