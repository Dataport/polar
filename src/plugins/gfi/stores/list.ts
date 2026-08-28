import type { Feature } from 'ol'
import type { FeatureListText } from '../types'

import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { computed, markRaw, ref, shallowRef } from 'vue'

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

	const hoveredFeatures = shallowRef<Record<string, Feature[]>>({})
	if (configuration.value?.bindWithCoreHoverSelect) {
		useBindWithCoreHoverSelect(
			hoveredFeatures,
			gfiMainStoreRefs.selectedFeatures,
			coreStoreRefs.hoveredFeature,
			coreStoreRefs.selectedFeature
		)
	}

	function hover(data: { layerId: string; feature: Feature } | null) {
		if (data === null) {
			if (Object.keys(hoveredFeatures.value).length) {
				hoveredFeatures.value = markRaw({})
			}
			return
		}

		const { layerId, feature } = data
		if (hoveredFeatures.value[layerId]?.includes(feature)) {
			return
		}
		hoveredFeatures.value = markRaw({
			[layerId]: markRaw([feature]),
		})
	}

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
		computed(() => activeLayerList.value.map(({ source }) => source)),
		computed(() => coreStore.extent),
		() =>
			markRaw(
				Object.fromEntries(
					activeLayerList.value
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
				return Object.values(hoveredFeatures.value).some((features) =>
					features.includes(feature.feature)
				)
			},
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
		hover,
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
