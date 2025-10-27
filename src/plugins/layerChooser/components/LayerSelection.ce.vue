<template>
	<PolarCard class="polar-layer-chooser-card">
		<PolarInputGroup
			v-if="backgrounds.length"
			:legend="$t(($) => $.backgroundTitle, { ns: PluginId })"
		>
			<PolarInput
				v-for="{ name, id } in backgrounds"
				:key="`polar-layer-chooser-background-radio-${id}`"
				v-model="activeBackgroundId"
				:id-suffix="`polar-layer-chooser-background`"
				:label="name"
				type="radio"
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
					:legend="$t(($) => $[`${type}Title`], { ns: PluginId })"
				>
					<div
						v-for="{ name, id } in masks"
						:key="`polar-layer-chooser-mask-${type}-checkbox-${id}`"
						class="polar-layer-chooser-checkbox-wrapper"
					>
						<PolarInput
							v-model="activeMaskIds"
							:id-suffix="`polar-layer-chooser-mask-${type}`"
							:label="name"
							type="checkbox"
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
								{{ $t(($) => $.layerOptions, { ns: PluginId }) }}
							</span>
						</button>
					</div>
				</PolarInputGroup>
			</template>
		</template>
	</PolarCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLayerChooserStore } from '../store'
import { PluginId } from '../types'
import PolarCard from '@/components/PolarCard.ce.vue'
import PolarInput from '@/components/PolarInput.ce.vue'
import PolarInputGroup from '@/components/PolarInputGroup.ce.vue'

const layerChooserStore = useLayerChooserStore()
const {
	activeBackgroundId,
	activeMaskIds,
	backgrounds,
	disabledBackgrounds,
	disabledMasks,
	layersWithOptions,
	masksSeparatedByType,
	shownMasks,
} = storeToRefs(layerChooserStore)

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

	button {
		pointer-events: all;
	}
}

.kern-btn {
	width: var(--kern-metric-dimension-large);
	min-height: var(--kern-metric-dimension-large);
	border: none;
	border-radius: 50%;
}
</style>
