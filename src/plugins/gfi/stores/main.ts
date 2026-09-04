import type Layer from 'ol/layer/Layer'
import type { CustomHighlightStyle, GfiPluginOptions } from '../types'

import { Fill, Stroke, Style } from 'ol/style'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed } from 'vue'

import { useCoreStore } from '@/core/stores'
import { findLayer } from '@/lib/findLayer'

import { useFeatureDisplayLayer } from '../composables/useFeatureDisplayLayer'
import { useSelectedFeatures } from '../composables/useSelectedFeatures'
import { useVisibleLayers } from '../composables/useVisibleLayers'
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

	const windowLayers = computed(() =>
		Object.entries(configuration.value.layers)
			.filter(([, layerConfig]) => layerConfig.window)
			.map(([layerId]) => findLayer(coreStore.map, layerId))
			.filter((layer): layer is Layer => Boolean(layer))
	)
	const { visibleLayers: activeWindowLayers } = useVisibleLayers(windowLayers)
	const hasActiveWindowLayers = computed(
		() => activeWindowLayers.value.length > 0
	)

	const { olFeatures, olFeature, geoJsonFeatures, geoJsonFeature } =
		useSelectedFeatures()

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
		Object.entries(geoJsonFeatures.value)
			.filter(([layerId]) => getLayerConfiguration(layerId)?.geometry ?? false)
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
		hasActiveWindowLayers,
		olFeatures,
		olFeature,
		geoJsonFeatures,
		geoJsonFeature,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useGfiMainStore, import.meta.hot))
}
