import i18next from 'i18next'
import { Map } from 'ol'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type Coordinate } from 'ol/coordinate'
import type { MapConfiguration, MasterportalApiConfiguration } from '../types'
import defaults from '../utils/defaults'

export const useCoreStore = defineStore('core', () => {
	const center = ref<Coordinate>([0, 0])
	// NOTE: The additional values are not required in the configuration but have default values.
	const configuration = ref<
		MapConfiguration &
			Required<
				Pick<
					MasterportalApiConfiguration,
					'epsg' | 'namedProjections' | 'options' | 'startResolution'
				>
			>
	>({
		layers: [],
		layerConf: [],
		startCenter: [0, 0],
		...defaults,
	})
	const language = ref(i18next.language)
	// TODO: Check whether the initial value (needed for proper typing) breaks stuff
	const map = ref(new Map())
	const zoom = ref(0)

	function setCenter() {
		// @ts-expect-error | map always has a center
		center.value = map.value.getView().getCenter()
	}
	function setZoom() {
		// @ts-expect-error | map always has a zoom level defined
		zoom.value = map.value.getView().getZoom()
	}
	function setMap(newMap: Map) {
		map.value.un('moveend', setCenter)
		map.value.un('moveend', setZoom)
		map.value = newMap
		map.value.on('moveend', setCenter)
		map.value.on('moveend', setZoom)
		setCenter()
		setZoom()
	}

	return {
		// State
		configuration,
		language,
		map,
		// Actions
		setMap,
	}
})
