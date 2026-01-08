/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/gfi/store
 */
/* eslint-enable tsdoc/syntax */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, watch, type WatchHandle } from 'vue'
import { rawLayerList } from '@masterportal/masterportalapi'
import type { Feature as GeoJsonFeature } from 'geojson'
import type { Feature } from 'ol'
import { PluginId, type GfiPluginOptions } from './types'
import { requestGfi } from './utils/requestGfi'
import { serializeFeature } from './utils/serializeFeature'
import { useCoreStore } from '@/core/stores/export'
import { getRefStore } from '@/lib/getRefStore'
import { getVectorSource } from '@/lib/getVectorSource'
import { isVisible } from '@/lib/invisibleStyle'

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

	const featureInformation = ref<Record<string, GeoJsonFeature[]>>({})

	const listFeatures = computed(() => {
		// We want to re-calculate on extent changes, as the features change then.
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		coreStore.extent

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
							),
					]
				})
				.filter((layer): layer is [string, Feature[]] => Boolean(layer))
		)
	})

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
