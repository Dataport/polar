/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/routing/store
 */
/* eslint-enable tsdoc/syntax */

import type {
	FeatureCollection,
	LineString as GeoJsonLineString,
} from 'geojson'
import type { Coordinate } from 'ol/coordinate'

import { t } from 'i18next'
import { Feature } from 'ol'
import { LineString, Point } from 'ol/geom'
import Draw from 'ol/interaction/Draw'
import VectorLayer from 'ol/layer/Vector'
import { transform } from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import { Stroke, Style } from 'ol/style'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, watch, type WatchStopHandle } from 'vue'

import { useT } from '@/core/composables/useT.ts'
import { useCoreStore } from '@/core/stores'

import {
	PluginId,
	type RoutingPluginOptions,
	type SelectableTravelMode,
	type TravelMode,
} from './types.ts'
import { handleErrors } from './utils/handleErrors.ts'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for routing.
 */
/* eslint-enable tsdoc/syntax */
export const useRoutingStore = defineStore('plugins/routing', () => {
	const coreStore = useCoreStore()

	const routeSource = new VectorSource()
	let routeLayer: VectorLayer | undefined
	let draw: Draw | undefined

	let stopRouteWatch: WatchStopHandle | undefined
	let stopTravelModeWatch: WatchStopHandle | undefined

	// TODO(dopenguin): Update this to a computed so the draw interaction now added in setupPlugin only sometimes gets added
	const currentlyFocusedInput = ref(-1)
	const route = ref<Coordinate[]>([[], []])
	const routingResponseData = ref<FeatureCollection<GeoJsonLineString> | null>(
		null
	)
	const selectedPreference = ref('recommended')
	const selectedRouteTypesToAvoid = ref<string[]>([])
	const selectedTravelMode = ref('driving-car')

	const configuration = computed(
		() => (coreStore.configuration.routing || {}) as RoutingPluginOptions
	)
	const routeIncomplete = computed(() =>
		route.value.some((part) => part.length === 0)
	)
	const routeAsWGS84 = computed(() =>
		route.value.map((coordinate) =>
			transform(
				coordinate,
				coreStore.map.getView().getProjection().getCode(),
				'EPSG:4326'
			)
		)
	)
	const url = computed(
		() => configuration.value.url + selectedTravelMode.value + '/geojson'
	)
	const displayPreferences = computed(
		() => coreStore.configuration.routing?.displayPreferences || false
	)
	const selectablePreferences = computed(() =>
		['recommended', 'fastest', 'shortest'].map((value) => ({
			value,
			label: useT(() => t(($) => $.preference[value], { ns: PluginId })),
		}))
	)
	const displayRouteTypesToAvoid = computed(
		() => coreStore.configuration.routing?.displayRouteTypesToAvoid || false
	)
	const selectableRouteTypesToAvoid = computed(() =>
		selectedTravelMode.value === 'driving-car' ||
		selectedTravelMode.value === 'driving-hgv'
			? ['highways', 'tollways', 'ferries']
			: ['ferries']
	)
	const selectableTravelModes = computed<SelectableTravelMode[]>(
		() =>
			coreStore.configuration.routing?.selectableTravelModes || [
				'driving-car',
				'cycling-regular',
				'foot-walking',
			]
	)
	const travelModes = computed(() =>
		(
			[
				{
					value: 'driving-car',
					label: useT(() => t(($) => $.travelMode.car, { ns: PluginId })),
					icon: 'kern-icon--directions-car',
				},
				{
					value: 'driving-hgv',
					label: useT(() => t(($) => $.travelMode.hgv, { ns: PluginId })),
					icon: 'kern-icon--local-shipping',
				},
				{
					value: 'cycling-regular',
					label: useT(() => t(($) => $.travelMode.bike, { ns: PluginId })),
					icon: 'kern-icon--directions-bike',
				},
				{
					value: 'foot-walking',
					label: useT(() => t(($) => $.travelMode.walking, { ns: PluginId })),
					icon: 'kern-icon--directions-walk',
				},
				{
					value: 'wheelchair',
					label: useT(() =>
						t(($) => $.travelMode.wheelchair, { ns: PluginId })
					),
					icon: 'kern-icon--accessible',
				},
			] as TravelMode[]
		).filter(({ value }) => selectableTravelModes.value.includes(value))
	)

	function addCoordinateToRoute(coordinate: Coordinate) {
		route.value = route.value.toSpliced(
			currentlyFocusedInput.value,
			1,
			coordinate
		)
	}

	async function fetchRoute() {
		const response = await fetch(encodeURI(url.value), {
			method: 'POST',
			headers: {
				/* eslint-disable @typescript-eslint/naming-convention */
				'Content-Type': 'application/json',
				Authorization: configuration.value.apiKey as string, // TODO(dopenguin): Update function as this is now optional
				/* eslint-enable @typescript-eslint/naming-convention */
			},
			body: JSON.stringify({
				coordinates: routeAsWGS84.value,
				geometry: true,
				instructions: true,
				language: coreStore.language,
				options: {
					avoid_features: selectedRouteTypesToAvoid.value,
				},
				preference: selectedPreference.value,
				units: 'm',
			}),
		})
		if (!response.ok) {
			throw new Error(
				'Route could not be determined. Try different coordinates.'
			)
		}
		// TODO(dopenguin): Update type
		return response.json()
	}

	async function getRoute() {
		routeSource.clear()
		try {
			// TODO(dopenguin): Add AbortController
			const data = await fetchRoute()
			routingResponseData.value = data

			routeSource.addFeature(
				new Feature({
					geometry: new LineString(
						data.features[0].geometry.coordinates.map((coordinate) =>
							transform(
								coordinate,
								'EPSG:4326',
								coreStore.map.getView().getProjection().getCode()
							)
						)
					),
				})
			)
		} catch (error) {
			handleErrors(error)
		}
	}

	function initializeDraw() {
		draw = new Draw({ stopClick: true, type: 'Point' })
		// @ts-expect-error | internal hack to detect it in @polar/plugin-pins and @polar/plugin-gfi
		draw._isRoutingDraw = true
		draw.on('drawend', (e) => {
			addCoordinateToRoute((e.feature.getGeometry() as Point).getCoordinates())
			// @ts-expect-error | internal hack to detect it in @polar/plugin-pins and @polar/plugin-gfi
			draw._isRoutingDraw = false
		})
		coreStore.map.addInteraction(draw)
	}

	function setupPlugin() {
		routeLayer = new VectorLayer({
			source: routeSource,
			style: new Style({
				stroke: new Stroke({ color: 'blue', width: 6 }),
			}),
		})
		coreStore.map.addLayer(routeLayer)

		initializeDraw()
		stopRouteWatch = watch(
			[
				route,
				selectedPreference,
				selectedRouteTypesToAvoid,
				selectedTravelMode,
				() => coreStore.language,
			],
			() => {
				if (!routeIncomplete.value) {
					void getRoute()
				}
			}
		)
		stopTravelModeWatch = watch(selectedTravelMode, () => {
			selectedRouteTypesToAvoid.value = []
		})
	}

	function teardownPlugin() {
		stopRouteWatch?.()
		stopRouteWatch = undefined
		stopTravelModeWatch?.()
		stopTravelModeWatch = undefined

		reset()

		if (routeLayer) {
			coreStore.map.removeLayer(routeLayer)
			routeLayer = undefined
		}
		if (draw) {
			coreStore.map.removeInteraction(draw)
			draw = undefined
		}
	}

	function reset() {
		route.value = [[], []]
		currentlyFocusedInput.value = -1
		selectedPreference.value = 'recommended'
		selectedTravelMode.value = 'driving-car'
		selectedRouteTypesToAvoid.value = []
		routingResponseData.value = null
		routeSource.clear()
	}

	function setRoute(index: number, remove = false) {
		route.value = remove
			? route.value.toSpliced(index, 1)
			: route.value.toSpliced(index, 0, [])
	}

	return {
		/**
		 * TODO(dopenguin)
		 */
		currentlyFocusedInput,

		/**
		 * TODO(dopenguin)
		 */
		route,

		/**
		 * TODO(dopenguin)
		 */
		selectedPreference,

		/**
		 * TODO(dopenguin)
		 */
		selectedTravelMode,

		/**
		 * TODO(dopenguin)
		 */
		displayPreferences,

		/**
		 * TODO(dopenguin)
		 */
		selectablePreferences,

		/**
		 * TODO(dopenguin)
		 */
		displayRouteTypesToAvoid,

		/**
		 * TODO(dopenguin)
		 */
		selectedRouteTypesToAvoid,

		/**
		 * TODO(dopenguin)
		 */
		selectableRouteTypesToAvoid,

		/**
		 * TODO(dopenguin)
		 */
		travelModes,

		/**
		 * TODO(dopenguin)
		 */
		setRoute,

		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useRoutingStore, import.meta.hot))
}
