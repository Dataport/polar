import type { Feature as GeoJsonFeature } from 'geojson'
import type { Feature } from 'ol'

import { Fill, Stroke, Style } from 'ol/style'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, shallowRef, watch } from 'vue'

import { useCoreStore } from '@/core/stores'

import { useFeatureDisplayLayer } from '../composables/useFeatureDisplayLayer'
import {
	type CustomHighlightStyle,
	type GfiPluginOptions,
	PluginId,
} from '../types'
import { serializeFeature } from '../utils/serializeFeature'

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

	function getLayerConfiguration(layerId: string) {
		return configuration.value.layers[layerId]
	}

	const selectedFeatures = shallowRef<Record<string, Feature[]>>({})
	const featureInformation = ref<Record<string, GeoJsonFeature[]>>({})

	watch(
		selectedFeatures,
		(features) => {
			featureInformation.value = Object.fromEntries(
				Object.entries(features).map(([layerId, features]) => [
					layerId,
					features.map((feature) => serializeFeature(feature)),
				])
			)
		},
		{ immediate: true, deep: true }
	)

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
		getLayerConfiguration,
		selectedFeatures,
		featureInformation,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useGfiMainStore, import.meta.hot))
}
