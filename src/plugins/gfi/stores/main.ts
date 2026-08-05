import type { CustomHighlightStyle, GfiPluginOptions } from '../types'

import { Fill, Stroke, Style } from 'ol/style'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed } from 'vue'

import { useCoreStore } from '@/core/stores'

import { useFeatureDisplayLayer } from '../composables/useFeatureDisplayLayer'
import { useSelectedFeatures } from '../composables/useSelectedFeatures'
import { PluginId } from '../types'

const defaultHighlightStyle = {
	stroke: {
		color: '#003064',
		width: 3,
	},
	fill: {
		color: 'rgb(255, 255, 255, 0.7)',
	},
} satisfies CustomHighlightStyle

export const useGfiMainStore = defineStore('plugins/gfi/main', () => {
	const coreStore = useCoreStore()

	const configuration = computed(
		() => coreStore.configuration[PluginId] as GfiPluginOptions
	)

	const renderType = computed(
		() => configuration.value.renderType ?? 'independent'
	)

	function getLayerConfiguration(layerId: string) {
		return configuration.value.layers[layerId]
	}

	const { selectedFeatures, featureInformation } = useSelectedFeatures()

	const customHighlightStyle = computed(
		() =>
			new Style({
				stroke: new Stroke(
					configuration.value.customHighlightStyle?.stroke ||
						defaultHighlightStyle.stroke
				),
				fill: new Fill(
					configuration.value.customHighlightStyle?.fill ||
						defaultHighlightStyle.fill
				),
			})
	)
	const highlightedFeatures = computed(() =>
		Object.entries(featureInformation.value)
			.filter(([layerId]) => getLayerConfiguration(layerId)?.geometry ?? true)
			.flatMap(([, features]) => features)
	)
	useFeatureDisplayLayer(
		coreStore.map,
		highlightedFeatures,
		customHighlightStyle
	)

	return {
		configuration,
		renderType,
		getLayerConfiguration,
		selectedFeatures,
		featureInformation,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useGfiMainStore, import.meta.hot))
}
