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
					<PolarCheckbox
						v-for="{ name, id } in masks"
						:key="`polar-layer-chooser-mask-${type}-checkbox-${id}`"
						v-model="activeMasks"
						:id-suffix="`polar-layer-chooser-mask-${type}`"
						:label="name"
						:value="id"
						:disabled="disabledMasks[id]"
					/>
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

<style scoped>
.polar-layer-chooser-card {
	overflow-y: inherit !important;
}
</style>
