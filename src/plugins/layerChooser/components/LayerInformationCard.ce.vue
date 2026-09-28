<template>
	<PolarCard>
		<KernButton
			:id="`polar-layer-chooser-${identifier}-back-button`"
			class="kern-btn--secondary"
			icon="kern-icon--arrow-back"
			@click="close"
		>
			{{ $t(($) => $.returnToLayers, { ns: PluginId }) }}
		</KernButton>
		<slot />
	</PolarCard>
</template>
<script setup lang="ts">
import { nextTick, onMounted } from 'vue'

import KernButton from '@/components/kern/KernButton.ce.vue'
import PolarCard from '@/components/PolarCard.ce.vue'
import { useCoreStore } from '@/core/stores'

import { useLayerChooserStore } from '../store'
import { PluginId } from '../types'

const props = defineProps<{
	identifier: string
	idName: string
}>()

const coreStore = useCoreStore()
const layerChooserStore = useLayerChooserStore()

onMounted(() => {
	coreStore.shadowRoot
		?.getElementById(`polar-layer-chooser-${props.identifier}-back-button`)
		?.focus()
})

function close() {
	const previous = layerChooserStore[props.idName]
	layerChooserStore[props.idName] = ''
	void nextTick(() => {
		coreStore.shadowRoot
			?.getElementById(
				`polar-layer-chooser-${props.identifier}-${previous}-button`
			)
			?.focus()
	})
}
</script>
