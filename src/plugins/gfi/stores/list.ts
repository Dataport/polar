import type { Feature } from 'ol'
import type { FeatureList } from '../types'

import { GeoJSON } from 'ol/format'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { computed, ref, shallowRef, watch } from 'vue'

import { useOlVectorSources } from '@/composables/useOlVectorSources'
import { useRefStore } from '@/composables/useRefStore'
import { useCoreStore } from '@/core/stores'
import { getVectorSource } from '@/lib/getVectorSource'
import { isVisible } from '@/lib/invisibleStyle'

import { getSourceFeatures } from '../utils/getSourceFeatures'
import { useGfiMainStore } from './main'

export const useGfiListStore = defineStore('plugins/gfi/list', () => {
	const coreStore = useCoreStore()
	const gfiMainStore = useGfiMainStore()

	const hoveredFeatures = shallowRef<Record<string, Feature[]>>({})
	const { selectedFeatures } = storeToRefs(gfiMainStore)

	const configuration = computed(() => gfiMainStore.configuration.featureList)

	const activeLayers = computed((): string[] => {
		if (!configuration.value) {
			return []
		}

		const activeLayersRef = configuration.value.activeLayers
		const store = useRefStore(activeLayersRef)
		if (!store) {
			return []
		}
		return store[activeLayersRef.key]
	})

	const activeLayerList = computed(() =>
		activeLayers.value
			.map((layerId) => ({
				layerId,
				layerConfiguration: gfiMainStore.getLayerConfiguration(layerId),
				layer: coreStore.getLayer(layerId),
			}))
			.filter(
				(
					layer
				): layer is {
					[K in keyof typeof layer]: NonNullable<(typeof layer)[K]>
				} => Boolean(layer.layerConfiguration) && Boolean(layer.layer)
			)
			.map(({ layerId, layerConfiguration, layer }) => ({
				layerId,
				layerConfiguration,
				source: getVectorSource(layer),
			}))
	)

	function isHovered(feature: Feature) {
		return (
			coreStore.hoveredFeature === feature ||
			coreStore.hoveredFeature?.get('features')?.includes(feature)
		)
	}

	const features = useOlVectorSources(
		computed(() => activeLayerList.value.map(({ source }) => source)),
		computed(() => [coreStore.extent, coreStore.hoveredFeature]),
		() =>
			Object.fromEntries(
				activeLayerList.value
					.map(({ layerId, layerConfiguration, source }) => [
						layerId,
						getSourceFeatures(
							coreStore.map,
							source,
							configuration.value?.mode || 'visible'
						)
							.filter((feature) => isVisible(feature))
							.filter(
								(feature) =>
									!layerConfiguration.isSelectable ||
									layerConfiguration.isSelectable(
										new GeoJSON().writeFeatureObject(feature)
									)
							)
							.map((feature) => ({
								feature,
								...(configuration.value?.bindWithCoreHoverSelect
									? { hovered: isHovered(feature) }
									: {}),
							})),
					])
					.filter(
						(
							layer
						): layer is [string, { feature: Feature; hovered?: boolean }[]] =>
							Boolean(layer)
					)
			)
	)

	watch(
		[
			() => configuration.value?.bindWithCoreHoverSelect,
			() => coreStore.selectedFeature,
		],
		([bindMarkers, feature]) => {
			if (bindMarkers) {
				if (feature) {
					const newFeatures = feature.get('features') || [feature]
					if (newFeatures.length === 1) {
						selectedFeatures.value[feature.get('_polarLayerId')] = newFeatures
					}
				} else {
					selectedFeatures.value = {}
				}
			}
		},
		{ immediate: true, deep: true }
	)

	watch(
		[
			() => configuration.value?.bindWithCoreHoverSelect,
			() => hoveredFeatures.value,
		],
		([bindMarkers, featureMap]) => {
			if (bindMarkers) {
				const features = Object.entries(featureMap).flatMap(
					([layerId, features]) =>
						features.map((feature) => ({ layerId, feature }))
				)

				// The second condition is necessary for TypeScript checks.
				if (features.length <= 0 || !features[0]) {
					coreStore.hoveredFeature = null
					return
				}

				features[0].feature.set('_polarLayerId', features[0].layerId)
				coreStore.hoveredFeature = features[0].feature
			}
		},
		{ immediate: true, deep: true }
	)

	watch(
		[
			() => configuration.value?.bindWithCoreHoverSelect,
			() => selectedFeatures.value,
		],
		([bindMarkers, featureMap]) => {
			if (bindMarkers) {
				const features = Object.entries(featureMap).flatMap(
					([layerId, features]) =>
						features.map((feature) => ({ layerId, feature }))
				)

				// The second condition is necessary for TypeScript checks.
				if (features.length <= 0 || !features[0]) {
					coreStore.selectedFeature = null
					return
				}

				features[0].feature.set('_polarLayerId', features[0].layerId)
				coreStore.selectedFeature = features[0].feature
			}
		},
		{ immediate: true, deep: true }
	)

	const flatFeatures = computed(() =>
		Object.entries(features.value).flatMap(([layerId, features]) =>
			features.map((feature) => ({
				layerId,
				...feature,
			}))
		)
	)

	const page = ref(0)

	const pageLength = computed(() => configuration.value?.pageLength ?? 0)

	const paginationActive = computed(
		() => typeof configuration.value?.pageLength === 'number'
	)

	const paginationStartIndex = computed({
		get: () => (paginationActive.value ? page.value * pageLength.value : 0),
		set: (value) => {
			page.value = paginationActive.value
				? Math.round(value / pageLength.value)
				: 0
		},
	})

	const paginationEndIndex = computed(() =>
		paginationActive.value
			? paginationStartIndex.value + pageLength.value
			: undefined
	)

	const paginatedFeatures = computed(() =>
		flatFeatures.value.slice(
			paginationStartIndex.value,
			paginationEndIndex.value
		)
	)

	function getText(
		feature: Feature,
		type: keyof NonNullable<FeatureList['text']>
	) {
		const text = configuration.value?.text?.[type]
		if (typeof text === 'string') {
			return text
		}
		if (typeof text === 'function') {
			return text(feature)
		}
		return null
	}

	const enrichedPaginatedFeatures = computed(() =>
		paginatedFeatures.value.map((feature) => ({
			...feature,
			text: {
				title: getText(feature.feature, 'title'),
				subtitle: getText(feature.feature, 'subtitle'),
				subSubtitle: getText(feature.feature, 'subSubtitle'),
			},
		}))
	)

	return {
		features,
		hoveredFeatures,
		flatFeatures,
		paginationActive,
		pageLength,
		page,
		paginationStartIndex,
		paginationEndIndex,
		paginatedFeatures,
		enrichedPaginatedFeatures,
		getText,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useGfiListStore, import.meta.hot))
}
