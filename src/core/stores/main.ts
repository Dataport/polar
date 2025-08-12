import type { Feature, Map } from 'ol'
import type { Coordinate } from 'ol/coordinate'
import type { Point } from 'ol/geom'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { MapConfiguration, PluginContainer } from '../types'
import { SMALL_DISPLAY_HEIGHT, SMALL_DISPLAY_WIDTH } from '../utils/constants'
import { addInterceptor } from '../utils/addInterceptor'

// TODO(oeninghe-dataport): Remove this from store
// Currently, this is still needed for the marker store
let map: Map

export const useMainStore = defineStore('main', () => {
	const center = ref<Coordinate>([0, 0])
	const clientHeight = ref(0)
	const clientWidth = ref(0)
	const configuration = ref<MapConfiguration>({
		layers: [],
		startCenter: [0, 0],
	})
	const hasSmallDisplay = ref(false)
	const language = ref('')
	const lightElement = ref<HTMLElement | null>(null)
	const mapHasDimensions = ref<boolean>(false)
	const oidcToken = ref('')
	const plugins = ref<PluginContainer[]>([])
	const serviceRegister = ref<string | Record<string, unknown>[]>('')
	const shadowRoot = ref<ShadowRoot | null>(null)
	const zoom = ref(0)

	// TODO(dopenguin): Both will possibly be updated with different breakpoints -> Breakpoints are e.g. not valid on newer devices
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

	watch(
		() => configuration.value.secureServiceUrlRegex,
		(urlRegex) => {
			if (urlRegex) {
				addInterceptor(
					urlRegex,
					() => new Headers([['Authorization', `Bearer ${oidcToken.value}`]])
				)
			}
		}
	)

	function centerOnFeature(feature: Feature) {
		center.value = (feature.getGeometry() as Point).getCoordinates()
	}

	function updateHasSmallDisplay() {
		hasSmallDisplay.value =
			window.innerHeight <= SMALL_DISPLAY_HEIGHT ||
			window.innerWidth <= SMALL_DISPLAY_WIDTH
	}

	function getMap() {
		return map
	}
	function setMap(_map: Map) {
		map = _map
	}

	return {
		// State
		configuration,
		clientHeight,
		clientWidth,
		hasSmallDisplay,
		language,
		lightElement,
		mapHasDimensions,
		oidcToken,
		plugins,
		serviceRegister,
		shadowRoot,
		center,
		zoom,
		// Getters
		hasSmallHeight,
		hasSmallWidth,
		hasWindowSize,
		deviceIsHorizontal,
		getMap,
		// Actions
		centerOnFeature,
		updateHasSmallDisplay,
		setMap,
	}
})
