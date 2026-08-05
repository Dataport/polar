import type { Feature as GeoJsonFeature } from 'geojson'
import type { Feature } from 'ol'

import { GeoJSON } from 'ol/format'
import { computed, ref, shallowRef } from 'vue'

export function useSelectedFeatures() {
	const selectedFeatures = shallowRef<Record<string, Feature[]>>({})
	const featureInformation = ref<Record<string, GeoJsonFeature[]>>({})

	return {
		selectedFeatures: computed({
			get: () => selectedFeatures.value,
			set: (value) => {
				selectedFeatures.value = value
				featureInformation.value = Object.fromEntries(
					Object.entries(value).map(([layerId, features]) => [
						layerId,
						features.map((feature) =>
							new GeoJSON().writeFeatureObject(feature)
						),
					])
				)
			},
		}),
		featureInformation,
	}
}
