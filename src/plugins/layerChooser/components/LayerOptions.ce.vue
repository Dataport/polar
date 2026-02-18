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
					id-suffix="polar-layer-chooser-mask-options"
					:label="displayName"
					type="checkbox"
					:value="layerName"
					:class="
						options.some(({ layerImage }) => layerImage !== null)
							? 'polar-layer-chooser-options-checkbox'
							: ''
					"
				/>
			</div>
		</PolarInputGroup>
	</LayerInformationCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import PolarInput from '@/components/PolarInput.ce.vue'
import PolarInputGroup from '@/components/PolarInputGroup.ce.vue'
import { useCoreStore } from '@/core/stores'

import { useLayerChooserStore } from '../store'
import { type LayerOptions, PluginId } from '../types'
import LayerInformationCard from './LayerInformationCard.ce.vue'

const coreStore = useCoreStore()
const layerChooserStore = useLayerChooserStore()
const { openedOptionsId } = storeToRefs(layerChooserStore)

const options = computed(
	() =>
		layerChooserStore.layersWithOptions[openedOptionsId.value] as LayerOptions[]
)

// NOTE: Reversing the array is needed to preserve the order that is displayed in the map.
const layerIds = ref(options.value.map(({ layerName }) => layerName).reverse())

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

.kern-btn {
	border: none;
	min-height: inherit;
	padding: var(--kern-metric-space-x-small);
}

.kern-label {
	padding: 0;
	padding-left: var(--kern-metric-space-small);
}
</style>
