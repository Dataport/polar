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

import { useCoreStore } from '@/core/stores'
import { computedT } from '@/lib/computedT'

import {
	PluginId,
	type RoutingPluginOptions,
	type RoutingResponseData,
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

	const _currentlyFocusedInput = ref(-1)
	const route = ref<Coordinate[]>([[], []])
	const routingResponseData = ref<RoutingResponseData | null>(null)
	const selectedPreference = ref('recommended')
	const selectedRouteTypesToAvoid = ref<string[]>([])
	const selectedTravelMode = ref('driving-car')

	const configuration = computed(
		() => (coreStore.configuration.routing || {}) as RoutingPluginOptions
	)
	const currentlyFocusedInput = computed({
		get: () => _currentlyFocusedInput.value,
		set: (index) => {
			_currentlyFocusedInput.value = index

			if (index !== -1) {
				coreStore.map.addInteraction(draw as Draw)
			} else {
				coreStore.map.removeInteraction(draw as Draw)
			}
		},
	})
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
	const routeFeature = computed(
		() => routingResponseData.value?.features[0] ?? null
	)
	const showDetails = computed(() => routingResponseData.value !== null)
	const url = computed(
		() => configuration.value.url + selectedTravelMode.value + '/geojson'
	)
	const displayPreferences = computed(
		() => coreStore.configuration.routing?.displayPreferences || false
	)
	const selectablePreferences = computed(() =>
		['recommended', 'fastest', 'shortest'].map((value) => ({
			value,
			label: computedT(() => t(($) => $.preference[value], { ns: PluginId })),
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
					label: computedT(() => t(($) => $.travelMode.car, { ns: PluginId })),
					icon: 'kern-icon--directions-car',
				},
				{
					value: 'driving-hgv',
					label: computedT(() => t(($) => $.travelMode.hgv, { ns: PluginId })),
					icon: 'kern-icon--local-shipping',
				},
				{
					value: 'cycling-regular',
					label: computedT(() => t(($) => $.travelMode.bike, { ns: PluginId })),
					icon: 'kern-icon--directions-bike',
				},
				{
					value: 'foot-walking',
					label: computedT(() =>
						t(($) => $.travelMode.walking, { ns: PluginId })
					),
					icon: 'kern-icon--directions-walk',
				},
				{
					value: 'wheelchair',
					label: computedT(() =>
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

	async function fetchRoute(): Promise<RoutingResponseData> {
		const response = await fetch(encodeURI(url.value), {
			method: 'POST',
			headers: {
				/* eslint-disable @typescript-eslint/naming-convention */
				'Content-Type': 'application/json',
				...(configuration.value.apiKey && {
					Authorization: configuration.value.apiKey,
				}),
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
		return response.json()
	}

	async function getRoute() {
		routeSource.clear()
		try {
			// TODO(dopenguin): Add AbortController
			routingResponseData.value = await fetchRoute()

			if (!routeFeature.value) {
				throw new Error(t(($) => $.noFeature, { ns: PluginId }))
			}
			routeSource.addFeature(
				new Feature({
					geometry: new LineString(
						routeFeature.value.geometry.coordinates.map((coordinate) =>
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
			currentlyFocusedInput.value = -1
		})
	}

	function updateFocus(event: Event) {
		if (currentlyFocusedInput.value === -1) {
			return
		}
		const path = event.composedPath()
		const isRoutingInput = path.some(
			(el) =>
				el instanceof HTMLElement &&
				el.id.startsWith('polar-plugin-routing-input-')
		)
		const isMapViewport = path.includes(coreStore.map.getViewport())
		if (!isRoutingInput && !isMapViewport) {
			currentlyFocusedInput.value = -1
		}
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
		// TODO(dopenguin): Currently doesn't work if one tabs to another element
		;(coreStore.shadowRoot as ShadowRoot).addEventListener(
			'pointerdown',
			updateFocus
		)
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
		;(coreStore.shadowRoot as ShadowRoot).removeEventListener(
			'pointerdown',
			updateFocus
		)

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
		 * The coordinates selected by the user.
		 * If all coordinate pairs are filled, a route is requested.
		 */
		route,

		/**
		 * The response of the routing service depending on the {@link route} and
		 * other chosen options.
		 */
		routingResponseData,

		/**
		 * The input that currently has focus.
		 * Adds a draw interaction to the map if this value is not `-1` so the user
		 * can add a coordinate for the selected waypoint.
		 *
		 * @alpha
		 */
		currentlyFocusedInput,

		/**
		 * The preferences of the route type that a user can select.
		 *
		 * @alpha
		 */
		selectablePreferences,

		/**
		 * The types of routes that a user can select to avoid on their route.
		 *
		 * @alpha
		 */
		selectableRouteTypesToAvoid,

		/**
		 * The routing preference selected by the user.
		 *
		 * @alpha
		 */
		selectedPreference,

		/**
		 * The types of routes the user wishes to avoid on their route.
		 *
		 * @alpha
		 */
		selectedRouteTypesToAvoid,

		/**
		 * The selected mode of transportation by the user.
		 *
		 * @alpha
		 */
		selectedTravelMode,

		/**
		 * The modes of transportation a user can select.
		 * Is constrained by {@link RoutingPluginOptions.selectableTravelModes}.
		 *
		 * @alpha
		 */
		travelModes,

		/**
		 * Resets the state and clears the route layer source.
		 *
		 * @alpha
		 */
		reset,

		/**
		 * Inserts an empty coordinate pair into the route.
		 *
		 * @alpha
		 */
		setRoute,

		/**
		 * Value of {@link RoutingPluginOptions.displayPreferences}.
		 *
		 * @internal
		 */
		displayPreferences,

		/**
		 * Value of {@link RoutingPluginOptions.displayRouteTypesToAvoid}.
		 *
		 * @internal
		 */
		displayRouteTypesToAvoid,

		/**
		 * The feature of the {@link routingResponseData}.
		 * The ORS only returns one feature that is instead split in 1 to n segments.
		 *
		 * @internal
		 */
		routeFeature,

		/**
		 * Whether the route details should be displayed.
		 * Is `true` if {@link routingResponseData} is not `null`.
		 *
		 * @internal
		 */
		showDetails,

		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useRoutingStore, import.meta.hot))
}
