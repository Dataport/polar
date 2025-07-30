import { ping } from '@masterportal/masterportalapi'
import createStyle from '@masterportal/masterportalapi/src/vectorStyle/createStyle'
import styleList from '@masterportal/masterportalapi/src/vectorStyle/styleList'
import noop from '@repositoryname/noop'
import i18next from 'i18next'
import type { Feature, Map } from 'ol'
import { type Coordinate } from 'ol/coordinate'
import { easeOut } from 'ol/easing'
import { type FeatureLike } from 'ol/Feature'
import { type Point } from 'ol/geom'
import type VectorLayer from 'ol/layer/Vector'
import { type Interaction } from 'ol/interaction'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type {
	MapConfiguration,
	PluginContainer,
	PolarError,
	ServiceAvailabilityCheck,
} from '../types'
import { createPanAndZoomInteractions } from '../utils/interactions'
import { SMALL_DISPLAY_HEIGHT, SMALL_DISPLAY_WIDTH } from '../utils/constants'

let interactions: Interaction[] = []
let map: Map

export const useCoreStore = defineStore('core', () => {
	const center = ref<Coordinate>([0, 0])
	const clientHeight = ref(0)
	const clientWidth = ref(0)
	const configuration = ref<MapConfiguration>({
		layers: [],
		startCenter: [0, 0],
	})
	const errors = ref<PolarError[]>([])
	const hasSmallDisplay = ref(false)
	const language = ref(i18next.language)
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

	function centerOnFeature(feature: Feature) {
		map.getView().animate({
			center: (feature.getGeometry() as Point).getCoordinates(),
			duration: 400,
			easing: easeOut,
		})
	}

	function checkServiceAvailability() {
		const register = serviceRegister.value
		if (typeof register === 'string') {
			console.error(
				'polar/core.checkServiceAvailability: Action was called when the parameter serviceRegister was not yet set to an array of services.'
			)
			return
		}

		configuration.value.layers
			.map(({ id }) => register.find(({ id: serviceId }) => serviceId === id))
			.filter((service) => {
				if (!service) {
					console.warn(
						`polar/core.checkServiceAvailability: Service with id "${service.id}" not found in service register.`
					)
					return false
				}
				return true
			})
			.map(
				(service): ServiceAvailabilityCheck => ({
					ping: ping(service),
					serviceId: service.id,
					serviceName: service.name,
				})
			)
			.forEach(({ ping, serviceId, serviceName }) => {
				ping
					.then((statusCode) => {
						if (statusCode !== 200) {
							const toastStore = plugins.value.find(
								({ name }) => name === 'toast'
							)?.storeModule
							if (toastStore) {
								// TODO: Uncomment when toast plugin is implemented
								/* toastStore().addToast({
                    type: 'warning',
                    text: i18next.t('error.serviceUnavailable', {
                      serviceId,
                      serviceName,
                    }),
                  }) */
							}
							// always print status code for debugging purposes
							console.error(
								`polar/core: Ping to "${serviceId}" returned "${statusCode}".`
							)
							// always add to error log for listener purposes
							errors.value.push({
								type: 'connection',
								statusCode,
								text: `Ping to "${serviceId}" returned "${statusCode}".`,
							})
						}
					})
					.catch((e) => {
						console.error('polar/core', e)
					})
			})
	}

	function setCenter() {
		// @ts-expect-error | map always has a center
		center.value = map.getView().getCenter()
	}
	function setZoom() {
		// @ts-expect-error | map always has a zoom level defined
		zoom.value = map.getView().getZoom()
	}

	function getMap() {
		return map
	}

	async function setupStyling() {
		const register = serviceRegister.value

		if (configuration.value.featureStyles && Array.isArray(register)) {
			await styleList.initializeStyleList(
				// Masterportal specific field not required by POLAR
				{},
				{ styleConf: configuration.value.featureStyles },
				configuration.value.layers.map((layer) => {
					const layerConfig = register.find((l) => l.id === layer.id)
					if (layerConfig) {
						return {
							...layer,
							// Required by @masterportal/masterportalapi
							typ: layerConfig.typ,
						}
					}
					return layer
				}),
				// Masterportal specific field not required by POLAR
				[],
				// Callback currently yields no relevant benefit
				noop
			)
			// A layer can either be styled through the provided styles or through the markers configuration; markers takes precedence.
			const markerLayers = configuration.value.markers
				? configuration.value.markers.layers.map(({ id }) => id)
				: []
			map
				.getLayers()
				.getArray()
				.filter(
					(layer) =>
						typeof layer.get('styleId') === 'string' &&
						!markerLayers.includes(layer.get('id') as string)
				)
				.forEach((layer) => {
					const styleObject = styleList.returnStyleObject(layer.get('styleId'))
					if (styleObject) {
						;(layer as VectorLayer).setStyle((feature: Feature | FeatureLike) =>
							createStyle.createStyle(
								styleObject,
								feature,
								feature.get('features') !== undefined,
								// NOTE: This field may be implemented in the future to be able to style points with graphics
								''
							)
						)
					}
				})
		}
	}

	function setMap(newMap: Map) {
		// NOTE: Not defined in the beginning
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (map) {
			map.un('moveend', setCenter)
			map.un('moveend', setZoom)
		}
		map = newMap
		map.on('moveend', setCenter)
		map.on('moveend', setZoom)
		setCenter()
		setZoom()
	}

	function updateDragAndZoomInteractions() {
		interactions.forEach((i) => map.removeInteraction(i))
		interactions = createPanAndZoomInteractions(
			hasWindowSize.value,
			window.innerHeight <= SMALL_DISPLAY_HEIGHT ||
				window.innerWidth <= SMALL_DISPLAY_WIDTH
		)
		interactions.forEach((i) => {
			map.addInteraction(i)
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
			const size = map.getSize()
			if (attemptCounter++ < 100 && (!size || size[0] === 0 || size[1] === 0)) {
				map.updateSize()
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
		configuration,
		clientHeight,
		clientWidth,
		hasSmallDisplay,
		language,
		oidcToken,
		plugins,
		serviceRegister,
		// Getters
		hasSmallHeight,
		hasSmallWidth,
		hasWindowSize,
		deviceIsHorizontal,
		// Actions
		addInterceptor,
		centerOnFeature,
		checkServiceAvailability,
		getMap,
		setMap,
		setupStyling,
		updateDragAndZoomInteractions,
		updateHasSmallDisplay,
		updateSizeOnReady,
	}
})
