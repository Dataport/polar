<template>
	<PolarCard>
		<button
			:id="`polar-layer-chooser-${identifier}-back-button`"
			class="kern-btn kern-btn--secondary"
			@click="close"
		>
			<span class="kern-icon kern-icon--arrow-back" aria-hidden="true" />
			<span class="kern-label">
				{{ $t(($) => $.returnToLayers, { ns: PluginId }) }}
			</span>
		</button>
		<slot />
	</PolarCard>
</template>
<script setup lang="ts">
import { nextTick, onMounted } from 'vue'

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
