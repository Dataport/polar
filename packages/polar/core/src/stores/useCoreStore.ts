import i18next from 'i18next'
import { Map } from 'ol'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { type Coordinate } from 'ol/coordinate'
import { type Interaction } from 'ol/interaction'
import type { MapConfiguration, PluginContainer } from '../types'
import { createPanAndZoomInteractions } from '../utils/interactions'
import { SMALL_DISPLAY_HEIGHT, SMALL_DISPLAY_WIDTH } from '../utils/constants'

let interactions: Interaction[] = []

export const useCoreStore = defineStore('core', () => {
	const center = ref<Coordinate>([0, 0])
	const clientHeight = ref(0)
	const clientWidth = ref(0)
	const configuration = ref<MapConfiguration>({
		layers: [],
		startCenter: [0, 0],
	})
	const hasSmallDisplay = ref(false)
	const language = ref(i18next.language)
	// NOTE: Only instantiated here for proper typing
	const map = ref(new Map())
	const mapHasDimensions = ref(false)
	const oidcToken = ref('')
	const plugins = ref<PluginContainer[]>([])
	const serviceRegister = ref<string | Record<string, unknown>[]>('')
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

	// NOTE: Updates can happen if a user resizes the window or the fullscreen plugin is used.
	//       Added as a watcher to trigger the update at the correct time.
	watch(hasWindowSize, updateDragAndZoomInteractions)

	i18next.on('languageChanged', (newLanguage) => {
		language.value = newLanguage
	})

	function addInterceptor(secureServiceUrlRegex: string) {
		// NOTE: Not applicable here.
		// eslint-disable-next-line @typescript-eslint/unbound-method
		const { fetch: originalFetch } = window

		// If interceptors for XMLHttpRequest or axios are needed, add them here.
		window.fetch = (resource, originalConfig) => {
			let config = originalConfig

			if (
				oidcToken.value &&
				typeof resource === 'string' &&
				resource.match(secureServiceUrlRegex)
			) {
				config = {
					...originalConfig,
					headers: {
						// eslint-disable-next-line @typescript-eslint/naming-convention
						Authorization: `Bearer ${oidcToken.value}`,
						// NOTE: Currently expected that the headers are given as an object.
						// eslint-disable-next-line @typescript-eslint/no-misused-spread
						...originalConfig?.headers,
					},
				}
			}

			return originalFetch(resource, config)
		}
	}

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

	function updateHasSmallDisplay() {
		hasSmallDisplay.value =
			window.innerHeight <= SMALL_DISPLAY_HEIGHT ||
			window.innerWidth <= SMALL_DISPLAY_WIDTH
	}

	/*
	 * Albeit the map will render without this in Firefox, it won't in Chromium-
	 * based browsers. The map reports "No map visible because the map
	 * container's width or height are 0.". However, if updating the map's size
	 * after letting all other tasks in callback queue execute, the DOM is
	 * prepared, and we're good to go.
	 *
	 * TODO(dopenguin): Check if this is still required for the icon menu
	 *
	 * For some reason, we'll have to wait two callback queues sometimes.
	 * The waiting is arbitrarily limited to 100 queues before an error is shown.
	 */
	function updateSizeOnReady() {
		let attemptCounter = 0
		const intervalId = setInterval(() => {
			const size = map.value.getSize()
			if (attemptCounter++ < 100 && (!size || size[0] === 0 || size[1] === 0)) {
				map.value.updateSize()
			} else if (attemptCounter === 100) {
				console.error(
					`@polar/core: The POLAR map client could not update its size. The map is probably invisible due to having 0 width or 0 height. This might be a CSS issue – please check the wrapper's size.`
				)
				mapHasDimensions.value = false
				clearInterval(intervalId)
			} else {
				// OL prints warnings – add this log to reduce confusion
				// eslint-disable-next-line no-console
				console.log(
					`@polar/core: The map now has dimensions and can be rendered.`
				)
				mapHasDimensions.value = true
				clearInterval(intervalId)
			}
		}, 0)
	}

	return {
		// State
		plugins,
		configuration,
		clientHeight,
		clientWidth,
		hasSmallDisplay,
		language,
		map,
		oidcToken,
		serviceRegister,
		// Getters
		hasSmallHeight,
		hasSmallWidth,
		hasWindowSize,
		deviceIsHorizontal,
		// Actions
		addInterceptor,
		setMap,
		updateDragAndZoomInteractions,
		updateHasSmallDisplay,
		updateSizeOnReady,
	}
})
