import type Layer from 'ol/layer/Layer'
import type { Ref } from 'vue'

import { ref } from 'vue'
import { readonly } from 'vue'

import { watchArray } from '@/lib/watchArray'

export function useVisibleLayers(layers: Ref<Layer[]>) {
	const visibleLayers = ref<Layer[]>([])
	const updateVisibleLayers = () => {
		visibleLayers.value = layers.value.filter((layer) => layer.isVisible())
	}

	watchArray(
		layers,
		(layer) => {
			layer.on('change:visible', updateVisibleLayers)
			updateVisibleLayers()
		},
		(layer) => {
			layer.un('change:visible', updateVisibleLayers)
			updateVisibleLayers()
		},
		{ immediate: true, deep: true }
	)

	updateVisibleLayers()

	return {
		visibleLayers: readonly(visibleLayers),
	}
}
