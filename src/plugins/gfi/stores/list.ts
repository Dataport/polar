import type { Feature } from 'ol'
import type { FeatureListText } from '../types'

import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { computed, markRaw, ref, shallowRef, watch } from 'vue'

import { useOlVectorSources } from '@/composables/useOlVectorSources'
import { useRefStore } from '@/composables/useRefStore'
import { useCoreStore } from '@/core/stores'
import { findLayer } from '@/lib/findLayer'
import { getVectorSource } from '@/lib/getVectorSource'
import { isVisible } from '@/lib/invisibleStyle'

import { useBindWithCoreHoverSelect } from '../composables/useBindWithCoreHoverSelect'
import { filterSelectableFeatures } from '../utils/filterSelectableFeatures'
import { getSourceFeatures } from '../utils/getSourceFeatures'
import { useGfiMainStore } from './main'

export const useGfiListStore = defineStore('plugins/gfi/list', () => {
	const coreStore = useCoreStore()
	const coreStoreRefs = storeToRefs(coreStore)

	const gfiMainStore = useGfiMainStore()
	const gfiMainStoreRefs = storeToRefs(gfiMainStore)

	const configuration = computed(() => gfiMainStore.configuration.featureList)

	const hoveredFeature = shallowRef<{
		layerId: string
		feature: Feature
	} | null>(null)
	const hoveredFeatures = shallowRef<Record<string, Feature[]>>({})

	const activeLayerIds = computed((): string[] => {
		if (!configuration.value) {
			return []
		}

		const activeLayersRef = configuration.value.activeLayers
		const store = useRefStore(activeLayersRef)
		if (
			!store ||
			!Array.isArray(store[activeLayersRef.key]) ||
			!store[activeLayersRef.key].every(
				(layerId) => typeof layerId === 'string'
			)
		) {
			console.warn(
				`Invalid activeLayers configuration for key "${activeLayersRef.key}"`
			)
			return []
		}
		return store[activeLayersRef.key]
	})

	const activeLayers = computed(() =>
		activeLayerIds.value
			.map((layerId) => ({
				layerId,
				layerConfiguration: gfiMainStore.getLayerConfiguration(layerId),
				layer: findLayer(coreStore.map, layerId),
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

	const features = useOlVectorSources(
		computed(() => activeLayers.value.map(({ source }) => source)),
		computed(() => coreStore.extent),
		() =>
			markRaw(
				Object.fromEntries(
					activeLayers.value
						.map(({ layerId, layerConfiguration, source }) => [
							layerId,
							filterSelectableFeatures(
								getSourceFeatures(
									coreStore.map,
									source,
									configuration.value?.mode || 'visible'
								).filter((feature) => isVisible(feature)),
								layerConfiguration.isSelectable
							).map((feature) => ({ feature })),
						])
						.filter(
							(
								layer
							): layer is [string, { feature: Feature; hovered?: boolean }[]] =>
								Boolean(layer)
						)
				)
			)
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

	function getText(feature: Feature, type: keyof FeatureListText) {
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
			get hovered() {
				return (
					Object.values(hoveredFeatures.value).some((features) =>
						features.includes(feature.feature)
					) ||
					(configuration.value?.bindWithCoreHoverSelect &&
						coreStore.hoveredClusterFeatures.includes(feature.feature))
				)
			},
			text: {
				title: getText(feature.feature, 'title'),
				subtitle: getText(feature.feature, 'subtitle'),
				subSubtitle: getText(feature.feature, 'subSubtitle'),
			},
		}))
	)

	if (configuration.value?.bindWithCoreHoverSelect) {
		useBindWithCoreHoverSelect(
			// hovered feature
			hoveredFeature,
			coreStoreRefs.hoveredFeature,
			// hovered cluster
			hoveredFeatures,
			coreStoreRefs.hoveredClusterFeatures,
			// selected feature
			gfiMainStoreRefs.olFeature,
			coreStoreRefs.selectedFeature,
			// selected cluster
			gfiMainStoreRefs.olFeatures,
			coreStoreRefs.selectedClusterFeatures,
			// reference order
			computed(() => flatFeatures.value.map(({ feature }) => feature))
		)
	} else {
		watch(hoveredFeature, (value) => {
			if (value === null) {
				hoveredFeatures.value = {}
				return
			}
			const { layerId, feature } = value
			hoveredFeatures.value = { [layerId]: [feature] }
		})
		watch(gfiMainStoreRefs.olFeature, (value) => {
			if (value === null) {
				gfiMainStore.olFeatures = {}
				return
			}
			const { layerId, feature } = value
			gfiMainStore.olFeatures = { [layerId]: [feature] }
		})
	}

	return {
		features,
		hoveredFeature,
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
