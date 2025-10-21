import { Feature } from 'ol'
import { Point } from 'ol/geom'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CallOnMapSelect } from '../types'
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

	const hovered = ref<Feature | null>(null)
	const selected = ref<Feature | null>(null)
	const selectedCoordinates = computed(() =>
		selected.value === null
			? null
			: (selected.value.getGeometry() as Point).getCoordinates()
	)

	return {
		configuration,
		callOnMapSelect,
		clusterClickZoom,

		hovered,
		selected,
		selectedCoordinates,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useMarkerStore, import.meta.hot))
}
