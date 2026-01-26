import type { Feature, Map } from 'ol'
import type { Coordinate } from 'ol/coordinate'
import type { Point } from 'ol/geom'

import { toMerged } from 'es-toolkit'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, shallowRef, watch } from 'vue'

import type {
	ColorScheme,
	MapConfigurationIncludingDefaults,
	MasterportalApiServiceRegister,
} from '../types'

import { addInterceptor } from '../utils/addInterceptor'
import { SMALL_DISPLAY_HEIGHT, SMALL_DISPLAY_WIDTH } from '../utils/constants'
import defaults from '../utils/defaults'

export const useMainStore = defineStore('main', () => {
	const colorScheme = ref<ColorScheme>('system')
	const configuration = ref<MapConfigurationIncludingDefaults>(
		toMerged(
			{
				layers: [],
				startCenter: [0, 0],
			},
			defaults
		)
	)
	const language = ref('')
	const lightElement = ref<HTMLElement | null>(null)
	const map = shallowRef({} as Map)
	const serviceRegister = ref<MasterportalApiServiceRegister>([])
	const shadowRoot = ref<ShadowRoot | null>(null)

	const layout = computed(() => configuration.value.layout ?? 'standard')

	// TODO(dopenguin): Both will possibly be updated with different breakpoints -> Breakpoints are e.g. not valid on newer devices
	const clientHeight = ref(0)
	const clientWidth = ref(0)
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

	const hasSmallDisplay = ref(false)
	function updateHasSmallDisplay() {
		hasSmallDisplay.value =
			window.innerHeight <= SMALL_DISPLAY_HEIGHT ||
			window.innerWidth <= SMALL_DISPLAY_WIDTH
	}

	const oidcToken = ref('')
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

	const zoom = ref(0)

	watch(
		() => zoom.value,
		(zoomLevel) => {
			map.value.getView().setZoom(zoomLevel)
		}
	)

	const updateZoom = () => (zoom.value = map.value.getView().getZoom() || 0)

	const center = ref<Coordinate>([0, 0])
	function centerOnFeature(feature: Feature) {
		center.value = (feature.getGeometry() as Point).getCoordinates()
	}

	function setup() {
		addEventListener('resize', updateHasSmallDisplay)
		updateHasSmallDisplay()
		map.value.on('moveend', updateZoom)
	}

	function teardown() {
		removeEventListener('resize', updateHasSmallDisplay)
		map.value.un('moveend', updateZoom)
	}

	return {
		// State
		colorScheme,
		configuration,
		clientHeight,
		clientWidth,
		hasSmallDisplay,
		language,
		lightElement,
		map,
		oidcToken,
		serviceRegister,
		shadowRoot,
		center,
		zoom,
		// Getters
		layout,
		hasSmallHeight,
		hasSmallWidth,
		hasWindowSize,
		deviceIsHorizontal,
		// Actions
		centerOnFeature,
		updateHasSmallDisplay,
		setup,
		teardown,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
}
