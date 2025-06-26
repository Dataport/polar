import i18next from 'i18next'
import { Map } from 'ol'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { type Coordinate } from 'ol/coordinate'
import { type Interaction } from 'ol/interaction'
import type { MapConfiguration, MasterportalApiConfiguration } from '../types'
import defaults from '../utils/defaults'
import { createPanAndZoomInteractions } from '../utils/interactions'
import { SMALL_DISPLAY_HEIGHT, SMALL_DISPLAY_WIDTH } from '../utils/constants'

let interactions: Interaction[] = []

export const useCoreStore = defineStore('core', () => {
	const center = ref<Coordinate>([0, 0])
	const clientHeight = ref(0)
	const clientWidth = ref(0)
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

	// TODO: Both will possibly be updated with different breakpoints
	const hasSmallHeight = computed(
		() => clientHeight.value <= SMALL_DISPLAY_HEIGHT
	)
	const hasSmallWidth = computed(() => clientWidth.value <= SMALL_DISPLAY_WIDTH)
	const hasWindowSize = computed(
		() =>
			window.innerHeight === clientHeight.value &&
			window.innerWidth === clientWidth.value
	)
	const deviceIsHorizontal = computed(
		() => hasSmallHeight.value && hasWindowSize.value
	)

	// NOTE: Updates can happen if a user resizes the window or the fullscreen plugin is used.
	//       Added as a watcher to trigger the update at the correct time.
	// TODO: Add updateListeners here as well once implemented
	watch(hasWindowSize, updateDragAndZoomInteractions)

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

	// TODO: Still somewhat wonky, not sure why
	function updateDragAndZoomInteractions() {
		interactions.forEach((i) => map.value.removeInteraction(i))
		interactions = createPanAndZoomInteractions(
			hasWindowSize.value,
			window.innerHeight <= SMALL_DISPLAY_HEIGHT ||
				window.innerWidth <= SMALL_DISPLAY_WIDTH
		)
		interactions.forEach((i) => {
			map.value.addInteraction(i)
		})
	}

	return {
		// State
		configuration,
		clientHeight,
		clientWidth,
		language,
		map,
		// Getters
		hasSmallHeight,
		hasSmallWidth,
		hasWindowSize,
		deviceIsHorizontal,
		// Actions
		setMap,
		updateDragAndZoomInteractions,
	}
})
