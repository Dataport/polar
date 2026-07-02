import type { Feature } from 'ol'
import type { Point } from 'ol/geom'
import type { CallOnMapSelect } from '../types'

import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, shallowRef, watch } from 'vue'

import { useMainStore } from './main'

export const useMarkerStore = defineStore('marker', () => {
	const mainStore = useMainStore()
	const configuration = computed(() => mainStore.configuration.markers)

	const callOnMapSelect = computed(() =>
		typeof configuration.value?.callOnMapSelect === 'function'
			? (configuration.value.callOnMapSelect as CallOnMapSelect)
			: null
	)
	const clusterClickZoom = computed(
		() => (configuration.value?.clusterClickZoom as boolean) || false
	)

	const hovered = shallowRef<Feature | null>(null)
	const selected = shallowRef<Feature | null>(null)
	const selectedCoordinates = computed(() =>
		selected.value === null
			? null
			: (selected.value.getGeometry() as Point).getCoordinates()
	)

	const selectedBaseFeature = shallowRef<Feature | null>(null)
	watch(selected, (feature) => {
		if (feature) {
			const childFeatures = feature.get('features') as Feature[] | undefined
			if (childFeatures?.length === 1 && childFeatures[0]) {
				selectedBaseFeature.value = childFeatures[0]
			}
		} else {
			selectedBaseFeature.value = null
		}
	})

	return {
		configuration,
		callOnMapSelect,
		clusterClickZoom,

		hovered,
		selectedBaseFeature,
		selected,
		selectedCoordinates,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useMarkerStore, import.meta.hot))
}
