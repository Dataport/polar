<template>
	<PolarCard>
		<button
			id="polar-layer-chooser-options-back-button"
			class="kern-btn kern-btn--secondary"
			@click="closeOptions"
		>
			<span class="kern-icon kern-icon--arrow-back" aria-hidden="true" />
			<span class="kern-label">
				{{ $t(($) => $.returnToLayers, { ns: PluginId }) }}
			</span>
		</button>
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
	</PolarCard>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useLayerChooserStore } from '../store'
import { type LayerOptions, PluginId } from '../types'
import PolarCard from '@/components/PolarCard.ce.vue'
import PolarInput from '@/components/PolarInput.ce.vue'
import PolarInputGroup from '@/components/PolarInputGroup.ce.vue'
import { useCoreStore } from '@/core/stores/export'

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

onMounted(() => {
	coreStore.shadowRoot
		?.getElementById('polar-layer-chooser-options-back-button')
		?.focus()
})

function closeOptions() {
	const previousOptions = openedOptionsId.value
	openedOptionsId.value = ''
	// NOTE: Not relevant here as nothing is followed by the nextTick call.
	// eslint-disable-next-line @typescript-eslint/no-floating-promises
	nextTick(() => {
		coreStore.shadowRoot
			?.getElementById(`polar-layer-chooser-options-${previousOptions}-button`)
			?.focus()
	})
}
</script>

<style scoped>
.polar-layer-chooser-options-checkbox-wrapper {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	gap: var(--kern-metric-space-large, 1.5rem);
}

.polar-layer-chooser-options-checkbox {
	margin-left: 0 !important;
}

.kern-btn {
	border: none;
	min-height: inherit;
	padding: 0.25rem;
	pointer-events: all;
}

.kern-label {
	padding: 0;
	padding-left: var(--kern-metric-space-small);
}
</style>
