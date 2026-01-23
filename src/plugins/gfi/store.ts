/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/gfi/store
 */
/* eslint-enable tsdoc/syntax */

import type { Feature as GeoJsonFeature } from 'geojson'
import type { Feature } from 'ol'

import { rawLayerList } from '@masterportal/masterportalapi'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, watch, type WatchHandle } from 'vue'

import { useCoreStore } from '@/core/stores'
import { getRefStore } from '@/lib/getRefStore'
import { getVectorSource } from '@/lib/getVectorSource'
import { isVisible } from '@/lib/invisibleStyle'

import { PluginId, type GfiPluginOptions } from './types'
import { requestGfi } from './utils/requestGfi'
import { serializeFeature } from './utils/serializeFeature'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for feature information requests.
 */
/* eslint-enable tsdoc/syntax */
export const useGfiStore = defineStore('plugins/gfi', () => {
	const coreStore = useCoreStore()

	const configuration = computed(
		() => coreStore.configuration[PluginId] as GfiPluginOptions
	)

	const watchHandles = ref<WatchHandle[]>([])

	const hoveredFeatures = ref<Record<string, Feature[]>>({})
	const selectedFeatures = ref<Record<string, Feature[]>>({})

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

	const listFeatures = computed(() => {
		// We want to re-calculate on extent changes, as the features change then.
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		coreStore.extent

		// TODO: We also want to re-calculate when the features are actually loaded.
		// Currently, we need an extent change to reload the list.

		if (!configuration.value.featureList) {
			return {}
		}
		const activeLayersRef = configuration.value.featureList.activeLayers
		const store = getRefStore(activeLayersRef)
		if (!store) {
			return {}
		}
		const activeLayers = store[activeLayersRef.key] as string[]

		return Object.fromEntries(
			activeLayers
				.map((layerId) => {
					const layerConfiguration = configuration.value.layers[layerId]
					if (!layerConfiguration) {
						return false
					}

					const layer = coreStore.map
						.getAllLayers()
						.find((layer) => layer.get('id') === layerId)
					if (!layer) {
						return false
					}
					const source = getVectorSource(layer)

					return [
						layerId,
						(configuration.value.featureList?.mode === 'loaded'
							? source.getFeatures()
							: source.getFeaturesInExtent(
									coreStore.map
										.getView()
										.calculateExtent(coreStore.map.getSize()),
									coreStore.map.getView().getProjection()
								)
						)
							.filter((feature) => isVisible(feature))
							.filter(
								(feature) =>
									!layerConfiguration.isSelectable ||
									layerConfiguration.isSelectable(serializeFeature(feature))
							)
							.map((feature) => ({
								feature,
								...(configuration.value.featureList?.bindWithCoreHoverSelect
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
			() => configuration.value.featureList?.bindWithCoreHoverSelect,
			() => coreStore.selectedFeature,
		],
		([bindMarkers, feature]) => {
			if (bindMarkers && feature) {
				featureInformation.value[feature.get('_polarLayerId')] = feature.get(
					'features'
				)
					? feature.get('features').map((feature) => serializeFeature(feature))
					: [serializeFeature(feature as Feature)]
			}
		},
		{ immediate: true, deep: true }
	)

	watch(
		[
			() => configuration.value.featureList?.bindWithCoreHoverSelect,
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
			() => configuration.value.featureList?.bindWithCoreHoverSelect,
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

	async function getFeatureInfo(coordinate: [number, number]) {
		let result = Object.fromEntries(
			(
				await Promise.all(
					Object.entries(configuration.value.layers).map(
						async ([layerId, layerConfiguration]) => {
							const layer = coreStore.map
								.getAllLayers()
								.find((layer) => layer.get('id') === layerId)
							if (!layer) {
								return false
							}

							return [
								layerId,
								(
									await requestGfi({
										coordinateOrExtent: coordinate,
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
											configuration.value.mode ||
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
										configuration.value.maxFeatures || Number.POSITIVE_INFINITY
									),
							]
						}
					)
				)
			).filter((it): it is GeoJsonFeature[][] => Boolean(it))
		)

		if (configuration.value.afterLoadFunction) {
			result = configuration.value.afterLoadFunction(result)
		}

		featureInformation.value = result
		// TODO: Consider all the configuration options
	}

	function setupPlugin() {
		for (const source of configuration.value.coordinateSources || []) {
			const store = source.plugin
				? coreStore.getPluginStore(source.plugin)
				: coreStore
			if (!store) {
				continue
			}
			watchHandles.value.push(
				watch(
					() => store[source.key],
					async (coordinate) => {
						if (coordinate) {
							await getFeatureInfo(coordinate)
						} else {
							featureInformation.value = {}
						}
					},
					{ immediate: true }
				)
			)
		}
	}

	function teardownPlugin() {
		watchHandles.value.forEach((handle) => {
			handle()
		})
	}

	return {
		/** @alpha */
		configuration,

		/** @alpha */
		hoveredFeatures,

		/** @alpha */
		selectedFeatures,

		/** @alpha */
		featureInformation,

		/** @alpha */
		listFeatures,

		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useGfiStore, import.meta.hot))
}
