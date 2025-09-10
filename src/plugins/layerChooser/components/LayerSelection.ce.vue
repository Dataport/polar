<template>
	<PolarCard class="polar-layer-chooser-card">
		<PolarInputGroup
			v-if="backgrounds.length"
			legend="backgroundTitle"
			:legend-options="{ ns: PluginId }"
		>
			<PolarRadio
				v-for="{ name, id } in backgrounds"
				:key="`polar-layer-chooser-background-radio-${id}`"
				v-model="activeBackground"
				:id-suffix="`polar-layer-chooser-background`"
				:label="name"
				:value="id"
				:disabled="disabledBackgrounds[id]"
			/>
		</PolarInputGroup>
		<template v-if="shownMasks.length">
			<template
				v-for="[type, masks] in Object.entries(masksSeparatedByType)"
				:key="`polar-layer-chooser-mask-${type}`"
			>
				<PolarInputGroup
					:legend="`${type}Title`"
					:legend-options="{ ns: PluginId }"
				>
					<div
						v-for="{ name, id } in masks"
						:key="`polar-layer-chooser-mask-${type}-checkbox-${id}`"
						class="polar-layer-chooser-checkbox-wrapper"
					>
						<PolarCheckbox
							v-model="activeMasks"
							:id-suffix="`polar-layer-chooser-mask-${type}`"
							:label="name"
							:value="id"
							:disabled="disabledMasks[id]"
						/>
						<button
							v-if="Object.keys(layersWithOptions).includes(id)"
							:id="`polar-layer-chooser-options-${id}-button`"
							class="kern-btn kern-btn--tertiary"
							:disabled="disabledMasks[id]"
							@click="() => updateOpenedOptions(id)"
						>
							<span class="kern-icon kern-icon--settings" aria-hidden="true" />
							<span class="kern-label kern-sr-only">
								{{ $t('layerOptions', { ns: PluginId }) }}
							</span>
						</button>
					</div>
				</PolarInputGroup>
			</template>
		</template>
	</PolarCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useLayerChooserStore } from '../store'
import { PluginId } from '../types'
import PolarCard from '@/components/PolarCard.ce.vue'
import PolarCheckbox from '@/components/PolarCheckbox.ce.vue'
import PolarInputGroup from '@/components/PolarInputGroup.ce.vue'
import PolarRadio from '@/components/PolarRadio.ce.vue'

const layerChooserStore = useLayerChooserStore()
const {
	backgrounds,
	disabledBackgrounds,
	disabledMasks,
	layersWithOptions,
	masksSeparatedByType,
	shownMasks,
} = storeToRefs(layerChooserStore)

const activeBackground = computed({
	get: () => layerChooserStore.activeBackgroundId,
	set: (newValue) => {
		layerChooserStore.setActiveBackgroundId(newValue)
	},
})
const activeMasks = computed({
	get: () => layerChooserStore.activeMaskIds,
	set: (newValue) => {
		layerChooserStore.setActiveMaskIds(newValue)
	},
})

function updateOpenedOptions(layerId: string) {
	layerChooserStore.openedOptionsId = layerId
}
</script>

<style scoped>
.polar-layer-chooser-card {
	overflow-y: inherit !important;
}

.polar-layer-chooser-checkbox-wrapper {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: var(--kern-metric-space-large, 1.5rem);
}

.kern-btn {
	width: var(--kern-metric-dimension-large);
	min-height: var(--kern-metric-dimension-large);
	border: none;
	border-radius: 50%;
}
</style>
