<template>
	<div
		v-if="renderType === 'independent'"
		class="polar-plugin-attributions-wrapper"
		:class="{
			'open-left': openLeft,
		}"
	>
		<PolarIconButton
			:hint="
				$t(($) => $.button.title, {
					ns: PluginId,
					context: windowIsOpen ? 'close' : 'open',
				})
			"
			:icon="mapInfoIcon"
			:tooltip-position="openLeft ? 'left' : 'right'"
			@click="toggleMapInfo"
		/>
		<AttributionContent v-if="windowIsOpen" />
	</div>
	<AttributionContent v-else />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import PolarIconButton from '@/components/PolarIconButton.ce.vue'

import { useAttributionsStore } from '../store'
import { PluginId } from '../types'
import AttributionContent from './AttributionContent.ce.vue'

const attributionsStore = useAttributionsStore()
const { mapInfoIcon, renderType, windowIsOpen } = storeToRefs(attributionsStore)
const openLeft = computed(() =>
	attributionsStore.configuration.layoutTag?.includes('RIGHT')
)
function toggleMapInfo() {
	windowIsOpen.value = !windowIsOpen.value
}
</script>

<style scoped>
.polar-plugin-attributions-wrapper {
	display: flex;
	flex-direction: row;
	align-items: flex-end;
	margin: var(--kern-metric-space-small);

	&.open-left {
		flex-direction: row-reverse;
	}
}
</style>
