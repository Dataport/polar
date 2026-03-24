import type { Feature } from 'ol'

import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

import { useCoreStore } from '@/core/stores'
import { getRefStore } from '@/lib/getRefStore'
import { getVectorSource } from '@/lib/getVectorSource'
import { isVisible } from '@/lib/invisibleStyle'

import type { FeatureList } from '../types'

import { getSourceFeatures } from '../utils/getSourceFeatures'
import { serializeFeature } from '../utils/serializeFeature'
import { useGfiMainStore } from './main'

export const useGfiListStore = defineStore('plugins/gfi/list', () => {
	const coreStore = useCoreStore()
	const gfiMainStore = useGfiMainStore()

	const hoveredFeatures = ref<Record<string, Feature[]>>({})
	const { selectedFeatures } = storeToRefs(gfiMainStore)

	const configuration = computed(() => gfiMainStore.configuration.featureList)

	const activeLayers = computed((): string[] => {
		if (!configuration.value) {
			return []
		}

		const activeLayersRef = configuration.value.activeLayers
		const store = getRefStore(activeLayersRef)
		if (!store) {
			return []
		}
		return store[activeLayersRef.key]
	})

	const features = computed(() => {
		// We want to re-calculate on extent changes, as the features change then.
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		coreStore.extent

		// TODO: We also want to re-calculate when the features are actually loaded.
		// Currently, we need an extent change to reload the list.

		return Object.fromEntries(
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
				.map(({ layerId, layerConfiguration, layer }) => {
					const source = getVectorSource(layer)

					return [
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
									layerConfiguration.isSelectable(serializeFeature(feature))
							)
							.map((feature) => ({
								feature,
								...(configuration.value?.bindWithCoreHoverSelect
									? {
											hovered:
												coreStore.hoveredFeature === feature ||
												coreStore.hoveredFeature
													?.get('features')
													?.includes(feature),
										}
									: {}),
							})),
					]
				})
				.filter(
					(
						layer
					): layer is [string, { feature: Feature; hovered?: boolean }[]] =>
						Boolean(layer)
				)
		)
	})

	watch(
		[
			() => configuration.value?.bindWithCoreHoverSelect,
			() => coreStore.selectedFeature,
		],
		([bindMarkers, feature]) => {
			if (bindMarkers) {
				if (feature) {
					selectedFeatures.value[feature.get('_polarLayerId')] = feature.get(
						'features'
					) || [feature]
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
				const features = Object.values(featureMap).flat()

				if (features.length <= 0) {
					coreStore.selectedFeature = null
					return
				}

				coreStore.selectedFeature = features[0] as Feature
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
		getText,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useGfiListStore, import.meta.hot))
}
