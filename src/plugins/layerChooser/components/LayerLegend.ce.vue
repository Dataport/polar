<template>
	<LayerInformationCard
		identifier="legend"
		id-name="openedLegendId"
		class="legend-card"
	>
		<label class="kern-label" for="polar-layer-chooser-legend-anchor">
			{{ $t(($) => $.legend.to, { name: legend.name, ns: PluginId }) }}
		</label>
		<a
			id="polar-layer-chooser-legend-anchor"
			:href="legend.url"
			:aria-label="$t(($) => $.legend.to, { name: legend.name, ns: PluginId })"
			target="_blank"
		>
			<img
				:src="legend.url"
				:alt="$t(($) => $.legend.to, { name: legend.name, ns: PluginId })"
			/>
		</a>
	</LayerInformationCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useLayerChooserStore } from '../store'
import { type LayerLegend, PluginId } from '../types'
import LayerInformationCard from './LayerInformationCard.ce.vue'

const layerChooserStore = useLayerChooserStore()
const legend = computed(
	() =>
		layerChooserStore.layersWithLegends[
			layerChooserStore.openedLegendId
		] as LayerLegend
)
</script>

<style scoped>
.legend-card {
	overflow-y: scroll;

	a {
		pointer-events: all;
	}
}
</style>
