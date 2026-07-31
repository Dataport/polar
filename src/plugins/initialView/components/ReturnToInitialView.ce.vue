<template>
	<PolarIconButton
		:hint="$t(($) => $.label.return, { ns: PluginId })"
		icon="kern-icon--home"
		tooltip-position="left"
		@click="onClick"
	/>
</template>

<script setup lang="ts">
import PolarIconButton from '@/components/PolarIconButton.ce.vue'

import { useInitialViewStore } from '../store'
import { PluginId } from '../types'

const initialViewStore = useInitialViewStore()

function onClick() {
	initialViewStore.returnToInitialView()
}
</script>
