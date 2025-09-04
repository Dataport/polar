<template>
	<PolarCard>
		<PolarRadioGroup
			v-if="backgrounds.length"
			v-model="activeBackground"
			legend="backgroundTitle"
			:legend-ns="PluginId"
			:values="
				backgrounds.map(({ name, id }) => ({
					disabled: disabledBackgrounds[id],
					label: name,
					value: id,
				}))
			"
		/>
		<template v-if="shownMasks.length">
			<PolarCheckboxes
				v-for="[type, masks] in Object.entries(masksSeparatedByType)"
				:key="`polar-layer-chooser-mask-${type}`"
				v-model="activeMasks"
				:legend="`${type}Title`"
				:legend-ns="PluginId"
				:values="
					masks.map(({ name, id }) => ({
						disabled: disabledMasks[id],
						label: name,
						value: id,
					}))
				"
			/>
		</template>
	</PolarCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useLayerChooserStore } from '../store'
import { PluginId } from '../types'
import PolarCard from '@/components/PolarCard.ce.vue'
import PolarCheckboxes from '@/components/PolarCheckboxes.ce.vue'
import PolarRadioGroup from '@/components/PolarRadioGroup.ce.vue'

const layerChooserStore = useLayerChooserStore()
const {
	backgrounds,
	disabledBackgrounds,
	disabledMasks,
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
</script>
