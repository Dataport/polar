import type { Feature } from 'ol'

import { computed, shallowRef } from 'vue'

import { useMainStore } from '../stores/main'

export function useCenteredFeature() {
	const feature = shallowRef<Feature | null>(null)
	const mainStore = useMainStore()

	return {
		feature: computed({
			get: () => feature.value,
			set: (newFeature: Feature | null) => {
				feature.value = newFeature
				if (newFeature) {
					mainStore.centerOnFeature(newFeature)
				}
			},
		}),
	}
}
