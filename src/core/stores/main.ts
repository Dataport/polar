import type { Feature, Map } from 'ol'
import type { Coordinate } from 'ol/coordinate'
import type { Point } from 'ol/geom'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { MapConfiguration, PluginContainer } from '../types'
import { SMALL_DISPLAY_HEIGHT, SMALL_DISPLAY_WIDTH } from '../utils/constants'
import { addInterceptor } from '../utils/addInterceptor'

export const useMainStore = defineStore('main', () => {
	const configuration = ref<MapConfiguration>({
		layers: [],
		startCenter: [0, 0],
	})
	const language = ref('')
	const lightElement = ref<HTMLElement | null>(null)
	const map = ref<Map | null>(null)
	const plugins = ref<PluginContainer[]>([])
	const serviceRegister = ref<string | Record<string, unknown>[]>('')
	const shadowRoot = ref<ShadowRoot | null>(null)
	const zoom = ref(0)

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

	const center = ref<Coordinate>([0, 0])
	function centerOnFeature(feature: Feature) {
		center.value = (feature.getGeometry() as Point).getCoordinates()
	}

	function setup() {
		addEventListener('resize', updateHasSmallDisplay)
		updateHasSmallDisplay()
	}

	function teardown() {
		removeEventListener('resize', updateHasSmallDisplay)
	}

	return {
		// State
		configuration,
		clientHeight,
		clientWidth,
		hasSmallDisplay,
		language,
		lightElement,
		map,
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
		// Actions
		centerOnFeature,
		updateHasSmallDisplay,
		setup,
		teardown,
	}
})
