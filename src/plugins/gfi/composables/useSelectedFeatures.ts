import type { Feature as GeoJsonFeature } from 'geojson'
import type { Feature as OlFeature } from 'ol'

import { isEqual, mapValues } from 'es-toolkit'
import { GeoJSON } from 'ol/format'
import { computed, shallowRef } from 'vue'

interface FeaturePair {
	geoJsonFeature: GeoJsonFeature
	olFeature?: OlFeature
}

/**
 * The GFI plugin may be used either with a vector layer or using GFI requests.
 * If a vector layer is used, we have OpenLayers features that are converted to GeoJSON features.
 * Otherwise, the response are just GeoJSON features.
 *
 * This composable considers this and allows for both scenarios:
 * For vector layers, both features are updated.
 * For GFI requests, only the GeoJSON features are used.
 */
export function useSelectedFeatures() {
	const features = shallowRef<Record<string, FeaturePair[]>>({})
	const feature = shallowRef<(FeaturePair & { layerId: string }) | null>(null)

	const olFeatures = computed<Record<string, OlFeature[]>>({
		get: () =>
			mapValues(features.value, (list) =>
				list
					.filter(
						(feature): feature is FeaturePair & { olFeature: FeaturePair } =>
							'olFeature' in feature
					)
					.map(({ olFeature }) => olFeature)
			),
		set: (value) => {
			features.value = mapValues(value, (list) =>
				list.map((olFeature) => ({
					olFeature,
					geoJsonFeature: new GeoJSON().writeFeatureObject(olFeature),
				}))
			)
		},
	})

	const geoJsonFeatures = computed<Record<string, GeoJsonFeature[]>>({
		get: () =>
			mapValues(features.value, (list) =>
				list.map(({ geoJsonFeature }) => geoJsonFeature)
			),
		set: (value) => {
			features.value = mapValues(value, (list) =>
				list.map((geoJsonFeature) => ({ geoJsonFeature }))
			)
		},
	})

	const olFeature = computed<{
		layerId: string
		feature: OlFeature
	} | null>({
		get: () =>
			feature.value?.olFeature
				? {
						layerId: feature.value.layerId,
						feature: feature.value.olFeature,
					}
				: null,
		set: (value) => {
			if (value === null) {
				feature.value = null
				return
			}
			const layerId = value.layerId
			feature.value = {
				layerId,
				olFeature: value.feature,
				geoJsonFeature: new GeoJSON().writeFeatureObject(value.feature),
			}
		},
	})

	const geoJsonFeature = computed<{
		layerId: string
		feature: GeoJsonFeature
	} | null>({
		get: () =>
			feature.value
				? {
						layerId: feature.value.layerId,
						feature: feature.value.geoJsonFeature,
					}
				: null,
		set: (value) => {
			if (value === null) {
				feature.value = null
				return
			}
			const layerId = value.layerId
			const item = features.value[layerId]?.find(({ geoJsonFeature }) =>
				isEqual(geoJsonFeature, value.feature)
			)
			feature.value = item
				? { ...item, layerId }
				: { layerId, geoJsonFeature: value.feature }
		},
	})

	return {
		olFeatures,
		olFeature,
		geoJsonFeatures,
		geoJsonFeature,
	}
}
