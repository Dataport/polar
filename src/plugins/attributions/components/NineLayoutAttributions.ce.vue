<template>
	<div
		v-if="renderType === 'independent'"
		class="polar-plugin-attributions-wrapper"
	>
		<template v-if="openLeft">
			<PolarIconButton
				:hint="
					$t(($) => $.button[`${windowIsOpen ? 'close' : 'open'}Title`], {
						ns: PluginId,
					})
				"
				:icon="mapInfoIcon"
				tooltip-position="left"
				@click="toggleMapInfo"
			/>
			<AttributionContent v-if="windowIsOpen" />
		</template>
		<template v-else>
			<AttributionContent v-if="windowIsOpen" />
			<PolarIconButton
				:hint="
					$t(($) => $.button[`${windowIsOpen ? 'close' : 'open'}Title`], {
						ns: PluginId,
					})
				"
				:icon="mapInfoIcon"
				tooltip-position="right"
				@click="toggleMapInfo"
			/>
		</template>
	</div>
	<AttributionContent v-else />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import PolarIconButton from '@/components/PolarIconButton.ce.vue'
import { useCoreStore } from '@/core/stores'

import { useAttributionsStore } from '../store'
import { PluginId } from '../types'
import AttributionContent from './AttributionContent.ce.vue'

const attributionsStore = useAttributionsStore()
const { mapInfoIcon, renderType, windowIsOpen } = storeToRefs(attributionsStore)
const openLeft = computed(() =>
	useCoreStore().configuration.attributions?.layoutTag?.includes('right')
)
function toggleMapInfo() {
	windowIsOpen.value = !windowIsOpen.value
}
</script>

<style scoped>
.polar-plugin-attributions-wrapper {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: flex-end;
	padding: 6px;
}
</style>
