import type { Feature as GeoJsonFeature } from 'geojson'

import { rawLayerList } from '@masterportal/masterportalapi'
import { isEqual } from 'es-toolkit'
import { MapBrowserEvent, Overlay } from 'ol'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, nextTick, onScopeDispose, ref, watch } from 'vue'

import { useCoreStore } from '@/core/stores'

import { useMultiSelection } from '../composables/useMultiSelection'
import {
	PluginId,
	type GfiLayerConfiguration,
	type RequestGfiParameters,
} from '../types'
import { requestGfi } from '../utils/requestGfi'
import { updateTooltip } from '../utils/updateTooltip'
import { useGfiMainStore } from './main'

export const useGfiFeatureStore = defineStore('plugins/gfi/feature', () => {
	const coreStore = useCoreStore()
	const gfiMainStore = useGfiMainStore()

	async function getFeatureInfo(
		coordinateOrExtent: RequestGfiParameters['coordinateOrExtent'],
		options: {
			toggleSelection?: boolean
		} = {}
	) {
		let result = Object.fromEntries(
			(
				await Promise.all(
					Object.entries(gfiMainStore.configuration.layers)
						.map(([layerId, layerConfiguration]) => ({
							layerId,
							layerConfiguration,
							layer: coreStore.getLayer(layerId),
						}))
						.filter(
							(
								layer
							): layer is {
								[K in keyof typeof layer]: NonNullable<(typeof layer)[K]>
							} => Boolean(layer.layer)
						)
						.map(async ({ layerId, layer, layerConfiguration }) => {
							return [
								layerId,
								(
									await requestGfi({
										coordinateOrExtent,
										layer,
										layerConfiguration,
										layerSpecification: rawLayerList.getLayerWhere({
											id: layerId,
										}),
										map: coreStore.map,
										mode:
											coreStore.configuration.layers.find(
												(layer) => layer.id === layerId
											)?.gfiMode ||
											gfiMainStore.configuration.mode ||
											'bboxDot',
									})
								)
									.filter(
										(feature) =>
											!layerConfiguration.isSelectable ||
											layerConfiguration.isSelectable(feature)
									)
									.slice(
										0,
										gfiMainStore.configuration.maxFeatures ||
											Number.POSITIVE_INFINITY
									),
							]
						})
				)
			).filter((it): it is GeoJsonFeature[][] => Boolean(it))
		) as Record<string, GeoJsonFeature[]>

		if (gfiMainStore.configuration.afterLoadFunction) {
			result = gfiMainStore.configuration.afterLoadFunction(result)
		}

		if (options.toggleSelection) {
			Object.entries(result).forEach(([layerId, features]) => {
				if (!gfiMainStore.featureInformation[layerId]) {
					gfiMainStore.featureInformation[layerId] = []
				}
				const layerFeatureList = gfiMainStore.featureInformation[layerId]

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
			})
			return
		}

		gfiMainStore.featureInformation = result
	}

	for (const source of gfiMainStore.configuration.coordinateSources || []) {
		const store = source.plugin
			? coreStore.getPluginStore(source.plugin)
			: coreStore
		if (!store) {
			continue
		}
		watch(
			() => store[source.key],
			async (coordinate) => {
				if (coordinate) {
					await getFeatureInfo(coordinate)
				} else {
					gfiMainStore.featureInformation = {}
				}
			},
			{ immediate: true }
		)
	}

	if (gfiMainStore.configuration.multiSelect) {
		const multiSelection = useMultiSelection({
			map: coreStore.map,
			mode: gfiMainStore.configuration.multiSelect,
		})
		watch(multiSelection.selection, async (selection) => {
			if (selection) {
				await getFeatureInfo(selection)
			} else {
				gfiMainStore.featureInformation = {}
			}
		})
	}

	if (gfiMainStore.configuration.directSelect) {
		async function onMapClick({ coordinate, originalEvent }: MapBrowserEvent) {
			await getFeatureInfo(coordinate as [number, number], {
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

	const visibleFeatures = computed(() =>
		Object.entries(gfiMainStore.featureInformation)
			.filter(([layerId]) => gfiMainStore.configuration.layers[layerId]?.window)
			.flatMap(([layerId, features]) =>
				features.map((feature) => ({ layerId, feature }))
			)
	)

	const selectedFeatureIndex = ref(0)
	const selectedFeature = computed(
		() => visibleFeatures.value[selectedFeatureIndex.value]
	)

	const selectedFeatureLayerConfiguration = computed(() =>
		gfiMainStore.getLayerConfiguration(selectedFeature.value?.layerId || '')
	)

	const selectedFeaturePropertiesLayerConfiguration = computed(
		() => selectedFeatureLayerConfiguration.value?.properties
	)

	const selectedFeatureProperties = computed(() =>
		Object.fromEntries(
			Object.entries(selectedFeature.value?.feature.properties || {})
				.filter(
					([key]) =>
						!selectedFeaturePropertiesLayerConfiguration.value ||
						selectedFeaturePropertiesLayerConfiguration.value.includes(key)
				)
				.map(([key, value]) => [key, value])
		)
	)

	const exportPropertyLayerConfiguration = computed(
		() => selectedFeatureLayerConfiguration.value?.exportProperty
	)

	const exportProperty = computed(() =>
		exportPropertyLayerConfiguration.value
			? selectedFeature.value?.feature.properties?.[
					exportPropertyLayerConfiguration.value
				]
			: null
	)

	watch(
		visibleFeatures,
		() => {
			selectedFeatureIndex.value = 0
		},
		{ deep: true }
	)

	const overlay = new Overlay({
		positioning: 'bottom-center',
		offset: [0, -5],
	})
	coreStore.map.addOverlay(overlay)
	let teardownTooltip: (() => void) | null = null
	coreStore.map.on('pointermove', (evt) => {
		if (teardownTooltip) {
			teardownTooltip()
		}

		teardownTooltip = updateTooltip(
			evt,
			overlay,
			Object.fromEntries(
				Object.entries(gfiMainStore.configuration.layers)
					.filter(([, { showTooltip }]) => Boolean(showTooltip))
					.map(([layerId, { showTooltip }]) => [layerId, showTooltip])
			) as Record<string, NonNullable<GfiLayerConfiguration['showTooltip']>>
		)
	})
	onScopeDispose(() => {
		if (teardownTooltip) {
			teardownTooltip()
		}
		coreStore.map.removeOverlay(overlay)
	})

	if (gfiMainStore.configuration.renderType === 'iconMenu') {
		// TODO: Find a better solution to wait for this plugin
		// As, in this case, we render as part of the iconMenu, the iconMenu store will be available soon.
		void nextTick(() => {
			const iconMenuStore = coreStore.getPluginStore('iconMenu')
			if (iconMenuStore) {
				watch(selectedFeature, (newFeature) => {
					if (newFeature) {
						iconMenuStore.openMenuById(PluginId)
					}
				})
			}
		})
	}

	return {
		visibleFeatures,
		selectedFeatureIndex,
		selectedFeature,
		selectedFeatureProperties,
		exportProperty,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useGfiFeatureStore, import.meta.hot))
}
