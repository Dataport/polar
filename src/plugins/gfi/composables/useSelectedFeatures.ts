import type { Feature as GeoJsonFeature } from 'geojson'
import type { Feature as OlFeature } from 'ol'

import { isEqual, mapValues } from 'es-toolkit'
import { GeoJSON } from 'ol/format'
import { computed, shallowRef } from 'vue'

interface Feature {
	geojsonFeature: GeoJsonFeature
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
	const features = shallowRef<Record<string, Feature[]>>({})
	const feature = shallowRef<(Feature & { layerId: string }) | null>(null)

	const olFeatures = computed<Record<string, OlFeature[]>>({
		get: () =>
			mapValues(features.value, (list) =>
				list
					.filter(
						(feature): feature is Feature & { olFeature: Feature } =>
							'olFeature' in feature
					)
					.map(({ olFeature }) => olFeature)
			),
		set: (value) => {
			features.value = mapValues(value, (list) =>
				list.map((olFeature) => ({
					olFeature,
					geojsonFeature: new GeoJSON().writeFeatureObject(olFeature),
				}))
			)
		},
	})

	const geojsonFeatures = computed<Record<string, GeoJsonFeature[]>>({
		get: () =>
			mapValues(features.value, (list) =>
				list.map(({ geojsonFeature }) => geojsonFeature)
			),
		set: (value) => {
			features.value = mapValues(value, (list) =>
				list.map((geojsonFeature) => ({ geojsonFeature }))
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
				geojsonFeature: new GeoJSON().writeFeatureObject(value.feature),
			}
		},
	})

	const geojsonFeature = computed<{
		layerId: string
		feature: GeoJsonFeature
	} | null>({
		get: () =>
			feature.value
				? {
						layerId: feature.value.layerId,
						feature: feature.value.geojsonFeature,
					}
				: null,
		set: (value) => {
			if (value === null) {
				feature.value = null
				return
			}
			const layerId = value.layerId
			const item = features.value[layerId]?.find(({ geojsonFeature }) =>
				isEqual(geojsonFeature, value.feature)
			)
			feature.value = item
				? { ...item, layerId }
				: { layerId, geojsonFeature: value.feature }
		},
	})

	return {
		olFeatures,
		olFeature,
		geojsonFeatures,
		geojsonFeature,
	}
}
