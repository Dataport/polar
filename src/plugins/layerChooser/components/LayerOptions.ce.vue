<template>
	<LayerInformationCard identifier="options" id-name="openedOptionsId">
		<PolarInputGroup :legend="$t(($) => $.layerHeader, { ns: PluginId, name })">
			<div
				v-for="{ displayName, layerImage, layerName } in options"
				:key="`polar-layer-chooser-mask-options-checkbox-${layerName}`"
				class="polar-layer-chooser-options-checkbox-wrapper"
			>
				<img v-if="layerImage" :src="layerImage" :alt="layerName" />
				<PolarInput
					v-model="activeLayers"
					type="checkbox"
					name="polar-layer-chooser-mask-options"
					:value="layerName"
					:class="
						options.some(({ layerImage }) => layerImage !== null)
							? 'polar-layer-chooser-options-checkbox'
							: ''
					"
					:disabled="
						activeLayers.length === 1 && activeLayers.includes(layerName)
					"
				>
					{{ displayName }}
				</PolarInput>
			</div>
		</PolarInputGroup>
	</LayerInformationCard>
</template>

<script setup lang="ts">
import type Layer from 'ol/layer/Layer'
import type { ImageWMS, TileWMS } from 'ol/source'
import type { LayerOptions } from '../types'

import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'

import PolarInput from '@/components/PolarInput.ce.vue'
import PolarInputGroup from '@/components/PolarInputGroup.ce.vue'
import { useCoreStore } from '@/core/stores'

import { useLayerChooserStore } from '../store'
import { PluginId } from '../types'
import LayerInformationCard from './LayerInformationCard.ce.vue'

const coreStore = useCoreStore()
const layerChooserStore = useLayerChooserStore()
const { openedOptionsId } = storeToRefs(layerChooserStore)

const options = computed(
	() =>
		layerChooserStore.layersWithOptions[openedOptionsId.value] as LayerOptions[]
)

const layerIds = ref<string[]>([])

const activeLayers = computed({
	get: () => layerIds.value,
	set: (newIds) => {
		layerIds.value = newIds
		layerChooserStore.toggleOpenedOptionsServiceLayer(newIds)
	},
})
const name = computed(
	() =>
		coreStore.configuration.layers.find(
			({ id }) => id === openedOptionsId.value
		)?.name || ''
)

onMounted(() => {
	const layersInSource: string =
		(
			(
				coreStore.map
					.getLayers()
					.getArray()
					.find((l) => l.get('id') === openedOptionsId.value) as Layer<
					ImageWMS | TileWMS
				>
			).getSource() as ImageWMS | TileWMS
		).getParams().LAYERS || ''
	// NOTE: Reversing the array is needed to preserve the order that is displayed in the map.
	layerIds.value = options.value
		.filter(({ layerName }) => layersInSource.includes(layerName))
		.map(({ layerName }) => layerName)
		.reverse()
})
</script>

<style scoped>
.polar-layer-chooser-options-checkbox-wrapper {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	gap: var(--kern-metric-space-large);
}

.kern-form-check.polar-layer-chooser-options-checkbox {
	margin-left: 0;
}
</style>
