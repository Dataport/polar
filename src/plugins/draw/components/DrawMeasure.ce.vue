<template>
	<section v-if="showMeasureOptions" class="draw-help">
		<PolarSelect
			v-model="measureMode"
			:options="
				measureOptions.map(({ value, label }) => ({
					value,
					label: $t(($) => $.measurements[label], { ns: PluginId }),
				}))
			"
			:label="$t(($) => $.measurements.label, { ns: PluginId })"
		/>
	</section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import PolarSelect from '@/components/PolarSelect.ce.vue'

import { useDrawStore } from '../store'
import { PluginId } from '../types'

const drawStore = useDrawStore()
const { activeTool, configuration, drawMode, measureMode, measureOptions } =
	storeToRefs(drawStore)

const showMeasureOptions = computed(
	() =>
		activeTool.value === 'draw' &&
		configuration.value.showMeasure &&
		['LineString', 'Polygon'].includes(drawMode.value)
)
</script>

<style scoped>
.draw-help {
	width: 100%;
}
</style>
