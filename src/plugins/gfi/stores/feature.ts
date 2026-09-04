import type { MapBrowserEvent } from 'ol'
import type {
	GfiLayerConfiguration,
	RequestGfiParameters,
	ShowTooltip,
} from '../types'

import { debounce, isEqual, mapValues, pickBy } from 'es-toolkit'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, onScopeDispose, watch } from 'vue'

import { useRefStore } from '@/composables/useRefStore'
import { useStoreWatcher } from '@/composables/useStoreWatcher'
import { useCoreStore } from '@/core/stores'

import { useMultiSelection } from '../composables/useMultiSelection'
import { useTooltip } from '../composables/useTooltip'
import { retrieveFeaturesForCoordinateOrExtentOnConfiguredLayers } from '../utils/retrieveFeaturesForCoordinateOrExtentOnConfiguredLayers'
import { useGfiMainStore } from './main'

export const useGfiFeatureStore = defineStore('plugins/gfi/feature', () => {
	const coreStore = useCoreStore()
	const gfiMainStore = useGfiMainStore()

	const visibleFeatures = computed(() =>
		Object.entries(gfiMainStore.geoJsonFeatures)
			.filter(([layerId]) => gfiMainStore.configuration.layers[layerId]?.window)
			.flatMap(([layerId, features]) =>
				features.map((feature) => ({ layerId, feature }))
			)
	)

	const selectedFeatureIndex = computed({
		get: () =>
			visibleFeatures.value.findIndex((feature) =>
				isEqual(feature, gfiMainStore.geoJsonFeature)
			),
		set: (value) => {
			const feature = visibleFeatures.value[value]
			if (feature) {
				gfiMainStore.geoJsonFeature = feature
			}
		},
	})

	const selectedFeatureLayerConfiguration = computed(() =>
		gfiMainStore.getLayerConfiguration(
			gfiMainStore.geoJsonFeature?.layerId || ''
		)
	)

	const exportPropertyLayerConfiguration = computed(
		() => selectedFeatureLayerConfiguration.value?.exportProperty
	)

	const exportProperty = computed(() =>
		exportPropertyLayerConfiguration.value
			? (gfiMainStore.geoJsonFeature?.feature.properties?.[
					exportPropertyLayerConfiguration.value
				] as string | null)
			: null
	)

	const titleLayerConfiguration = computed(() =>
		typeof selectedFeatureLayerConfiguration.value?.title === 'string'
			? () => selectedFeatureLayerConfiguration.value?.title ?? null
			: (selectedFeatureLayerConfiguration.value?.title ?? null)
	)

	const title = computed(() =>
		titleLayerConfiguration.value && gfiMainStore.geoJsonFeature
			? titleLayerConfiguration.value(gfiMainStore.geoJsonFeature.feature)
			: null
	)

	const selectedFeaturePropertiesLayerConfiguration = computed(
		() => selectedFeatureLayerConfiguration.value?.properties
	)

	const selectedFeatureProperties = computed(() =>
		pickBy(
			gfiMainStore.geoJsonFeature?.feature.properties || {},
			(value, key) =>
				(!selectedFeaturePropertiesLayerConfiguration.value ||
					selectedFeaturePropertiesLayerConfiguration.value.includes(key)) &&
				(!exportPropertyLayerConfiguration.value ||
					key !== exportPropertyLayerConfiguration.value)
		)
	)

	async function getFeatureInfo(
		coordinateOrExtent: RequestGfiParameters['coordinateOrExtent'],
		options: {
			toggleSelection?: boolean
		} = {}
	) {
		let result = await retrieveFeaturesForCoordinateOrExtentOnConfiguredLayers(
			coreStore.map,
			coreStore.configuration.layers,
			gfiMainStore.configuration.layers,
			gfiMainStore.configuration.mode,
			gfiMainStore.configuration.maxFeatures,
			coordinateOrExtent
		)

		if (gfiMainStore.configuration.afterLoadFunction) {
			result = gfiMainStore.configuration.afterLoadFunction(result)
		}

		if (options.toggleSelection) {
			gfiMainStore.geoJsonFeatures = mapValues(result, (features, layerId) => {
				const layerFeatureList = gfiMainStore.geoJsonFeatures[layerId] ?? []
				features.forEach((feature) => {
					const oldFeatureIndex = layerFeatureList.findIndex((oldFeature) =>
						isEqual(oldFeature.properties, feature.properties)
					)
					if (oldFeatureIndex < 0) {
						layerFeatureList.push(feature)
					} else {
						layerFeatureList.splice(oldFeatureIndex, 1)
					}
				})
				return layerFeatureList
			})
			return
		}

		gfiMainStore.geoJsonFeatures = result
		selectedFeatureIndex.value = 0
	}

	const waitMs = computed(() => gfiMainStore.configuration.waitMs ?? 50)
	const debouncedGetFeatureInfo = debounce(getFeatureInfo, waitMs.value)

	useStoreWatcher(
		gfiMainStore.configuration.coordinateSources || [],
		(coordinate) => {
			if (coordinate) {
				debouncedGetFeatureInfo(
					coordinate as RequestGfiParameters['coordinateOrExtent']
				)
			} else {
				gfiMainStore.geoJsonFeatures = {}
			}
		},
		{ immediate: true }
	)

	if (gfiMainStore.configuration.multiSelect) {
		const multiSelection = useMultiSelection(
			coreStore.map,
			gfiMainStore.configuration.multiSelect
		)
		watch(multiSelection.selection, (selection) => {
			if (selection) {
				debouncedGetFeatureInfo(selection, {
					toggleSelection:
						gfiMainStore.configuration.multiSelect?.toggleSelection ?? true,
				})
			} else {
				gfiMainStore.geoJsonFeatures = {}
			}
		})
	}

	if (gfiMainStore.configuration.directSelect) {
		function onMapClick({ coordinate, originalEvent }: MapBrowserEvent) {
			if (coreStore.isInteractionMasked('click')) {
				return
			}
			debouncedGetFeatureInfo(coordinate as [number, number], {
				toggleSelection:
					navigator.userAgent.indexOf('Mac') !== -1
						? originalEvent.metaKey
						: originalEvent.ctrlKey,
			})
		}

		coreStore.map.on('click', onMapClick)
		onScopeDispose(() => {
			coreStore.map.un('click', onMapClick)
		})
	}

	watch(
		[
			() => gfiMainStore.configuration.coordinateTarget,
			() => gfiMainStore.geoJsonFeature,
		],
		([target, feature], [, oldFeature]) => {
			if (target && !feature && oldFeature) {
				const targetStore = useRefStore(target)
				if (!targetStore) {
					return
				}
				targetStore[target.key] = null
			}
		}
	)

	useTooltip(
		coreStore.map,
		mapValues(
			pickBy(gfiMainStore.configuration.layers, ({ showTooltip }) =>
				Boolean(showTooltip)
			) as Record<string, GfiLayerConfiguration>,
			({ showTooltip }) => showTooltip
		) as Record<string, ShowTooltip>
	)

	return {
		visibleFeatures,
		selectedFeatureIndex,
		selectedFeatureProperties,
		exportProperty,
		title,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useGfiFeatureStore, import.meta.hot))
}
