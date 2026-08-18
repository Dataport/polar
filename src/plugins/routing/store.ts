/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/routing/store
 */
/* eslint-enable tsdoc/syntax */

import type { Coordinate } from 'ol/coordinate'
import type { Point } from 'ol/geom'
import type { PolarGeoJsonFeature } from '@/core'
import type {
	RoutingPluginOptions,
	RoutingResponseData,
	SelectableTravelMode,
	TravelMode,
} from './types'

import { t } from 'i18next'
import { Feature } from 'ol'
import { LineString } from 'ol/geom'
import Draw from 'ol/interaction/Draw'
import { transform } from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import { useCoreStore } from '@/core/stores'
import { computedT } from '@/lib/computedT'
import SearchResultSymbols from '@/lib/searchResultSymbols'
import { selectSearchResult } from '@/lib/selectSearchResult'

import { useMarkerLayer } from './composables/useMarkerLayer'
import { useRouteLayer } from './composables/useRouteLayer'
import { PluginId } from './types'
import { handleErrors } from './utils/handleErrors'

interface SearchResult {
	categoryId: string
	categoryLabel: string
	features: {
		features: PolarGeoJsonFeature[]
	}
	groupId: string
}

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
	const markerSource = new VectorSource()
	let abortController: AbortController | null = null
	let draw: Draw | undefined

	const _currentlyFocusedInput = ref(-1)
	const route = ref<Coordinate[]>([[], []])
	const routeAddressTexts = ref<(string | null)[]>([null, null])
	const routingResponseData = ref<RoutingResponseData | null>(null)
	const selectedPreference = ref('recommended')
	const selectedRouteTypesToAvoid = ref<string[]>([])
	const selectedTravelMode = ref('driving-car')
	const routeInputValues = ref(['', ''])
	const routeSearchResults = ref<(SearchResult[] | symbol)[]>([
		SearchResultSymbols.NO_SEARCH,
		SearchResultSymbols.NO_SEARCH,
	])
	const routeSearchRequestCounters = ref([0, 0])

	const configuration = computed(
		() => (coreStore.configuration.routing || {}) as RoutingPluginOptions
	)

	const reverseGeocoderConfigured = computed(
		() => !!coreStore.configuration.reverseGeocoder
	)
	const addressSearchConfigured = computed(
		() => !!coreStore.configuration.addressSearch
	)

	const showSearchResultList = computed(
		() => addressSearchConfigured.value
		// addressSearchConfigured.value &&
		// reverseGeocoderConfigured.value &&
		// configuration.value.useAddressSearch
	)
	const focusAfterSearch = computed(
		() => coreStore.configuration.addressSearch?.focusAfterSearch ?? false
	)
	const selectedSearchGroupId = computed(
		() =>
			coreStore.getPluginStore('addressSearch')?.selectedGroupId ??
			'defaultGroup'
	)
	const inputValue = computed({
		get: () => {
			if (currentlyFocusedInput.value >= 0) {
				return routeInputValues.value[currentlyFocusedInput.value] ?? ''
			}
			return routeInputValues.value[0] ?? ''
		},
		set: (value) => {
			if (currentlyFocusedInput.value === -1) {
				return
			}
			setRouteInputValue(currentlyFocusedInput.value, value)
		},
	})

	const currentlyFocusedInput = computed({
		get: () => _currentlyFocusedInput.value,
		set: (index) => {
			_currentlyFocusedInput.value = index

			if (index !== -1) {
				coreStore.maskInteraction(
					'routing',
					'click',
					() => {
						coreStore.map.addInteraction(draw as Draw)
					},
					() => {
						coreStore.map.removeInteraction(draw as Draw)
					}
				)
			} else {
				coreStore.unmaskInteraction('routing', 'click')
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

	async function addCoordinateToRoute(coordinate: Coordinate) {
		const index = currentlyFocusedInput.value
		route.value = route.value.toSpliced(index, 1, coordinate)
		routeAddressTexts.value = routeAddressTexts.value.toSpliced(index, 1, '')
		if (reverseGeocoderConfigured.value) {
			const reverseGeocoderStore = coreStore.getPluginStore('reverseGeocoder')
			const [x, y] = coordinate
			if (x === undefined || y === undefined) {
				return
			}
			const feature = await reverseGeocoderStore?.reverseGeocode([x, y], false)
			routeAddressTexts.value[index] = feature?.title ?? ''
		}
	}

	function setRouteInputValue(index: number, value: string) {
		if (index < 0 || index >= route.value.length) {
			return
		}
		routeInputValues.value = routeInputValues.value.toSpliced(index, 1, value)
		void searchForRouteInput(index, value)
	}

	async function searchForRouteInput(
		index: number,
		input: string,
		autoselect: 'first' | 'only' | 'never' = 'never'
	) {
		if (!showSearchResultList.value) {
			return
		}
		if (index < 0 || index >= route.value.length) {
			return
		}

		const addressSearchStore = coreStore.getPluginStore('addressSearch')
		if (!addressSearchStore) {
			return
		}

		const currentCounter = (routeSearchRequestCounters.value[index] ?? 0) + 1
		routeSearchRequestCounters.value =
			routeSearchRequestCounters.value.toSpliced(index, 1, currentCounter)

		if (!input.trim().length) {
			routeSearchResults.value = routeSearchResults.value.toSpliced(
				index,
				1,
				SearchResultSymbols.NO_SEARCH
			)
			return
		}

		await addressSearchStore.search(input, 'never')

		if ((routeSearchRequestCounters.value[index] ?? 0) !== currentCounter) {
			return
		}

		const result = addressSearchStore.searchResults
		routeSearchResults.value = routeSearchResults.value.toSpliced(
			index,
			1,
			result
		)

		if (!Array.isArray(result)) {
			return
		}

		const firstFound = result.find(({ features }) => features.features.length)
		if (!firstFound) {
			return
		}
		const firstFeatures = firstFound.features.features

		if (
			(autoselect === 'first' && firstFeatures.length >= 1) ||
			(autoselect === 'only' && firstFeatures.length === 1)
		) {
			currentlyFocusedInput.value = index
			selectResult(
				firstFeatures[0] as PolarGeoJsonFeature,
				firstFound.categoryId
			)
		}
	}

	function setRouteInputValue(index: number, value: string) {
		if (index < 0 || index >= route.value.length) {
			return
		}
		routeInputValues.value = routeInputValues.value.toSpliced(index, 1, value)
		void searchForRouteInput(index, value)
	}

	async function searchForRouteInput(
		index: number,
		input: string,
		autoselect: 'first' | 'only' | 'never' = 'never'
	) {
		if (!showSearchResultList.value) {
			return
		}
		if (index < 0 || index >= route.value.length) {
			return
		}

		const addressSearchStore = coreStore.getPluginStore('addressSearch')
		if (!addressSearchStore) {
			return
		}

		const currentCounter = (routeSearchRequestCounters.value[index] ?? 0) + 1
		routeSearchRequestCounters.value =
			routeSearchRequestCounters.value.toSpliced(index, 1, currentCounter)

		if (
			!input.trim().length ||
			input.trim().length < addressSearchStore.minLength
		) {
			routeSearchResults.value = routeSearchResults.value.toSpliced(
				index,
				1,
				SearchResultSymbols.NO_SEARCH
			)
			return
		}

		await addressSearchStore
			.runSearch(input)
			.then((results: SearchResult[] | symbol) => {
				if ((routeSearchRequestCounters.value[index] ?? 0) !== currentCounter) {
					return
				}
				routeSearchResults.value = routeSearchResults.value.toSpliced(
					index,
					1,
					results
				)
			})
			.catch((error) => {
				if ((routeSearchRequestCounters.value[index] ?? 0) !== currentCounter) {
					return
				}
				routeSearchResults.value = routeSearchResults.value.toSpliced(
					index,
					1,
					SearchResultSymbols.NO_SEARCH
				)
				handleErrors(error)
			})

		if ((routeSearchRequestCounters.value[index] ?? 0) !== currentCounter) {
			return
		}

		const result = routeSearchResults.value[index] ?? []
		if (!Array.isArray(result)) {
			return
		}

		const firstFound = result.find(({ features }) => features.features.length)
		if (!firstFound) {
			return
		}
		const firstFeatures = firstFound.features.features

		if (
			(autoselect === 'first' && firstFeatures.length >= 1) ||
			(autoselect === 'only' && firstFeatures.length === 1)
		) {
			currentlyFocusedInput.value = index
			selectResult(
				firstFeatures[0] as PolarGeoJsonFeature,
				firstFound.categoryId
			)
		}
	}

	async function fetchRoute(signal: AbortSignal): Promise<RoutingResponseData> {
		const response = await fetch(url.value, {
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
			signal,
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
		if (abortController) {
			abortController.abort()
		}
		abortController = new AbortController()
		const { signal } = abortController
		try {
			routingResponseData.value = await fetchRoute(signal)

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
			if (!signal.aborted) {
				handleErrors(error)
			}
		}
	}

	function initializeDraw() {
		draw = new Draw({ stopClick: true, type: 'Point' })
		draw.on('drawend', async (e) => {
			await addCoordinateToRoute(
				(e.feature.getGeometry() as Point).getCoordinates()
			)
			coreStore.unmaskInteraction('routing', 'click')
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
		const isRoutingResultList = path.some(
			(el) =>
				el instanceof HTMLElement &&
				(el.id.startsWith('polar-result-list-routing-') ||
					el.closest('.polar-result-list-wrapper') !== null)
		)
		if (
			!isRoutingInput &&
			!isRoutingResultList &&
			!path.includes(coreStore.map.getTargetElement())
		) {
			currentlyFocusedInput.value = -1
		}
	}

	watch(
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
	watch(selectedTravelMode, () => {
		selectedRouteTypesToAvoid.value = []
	})

	useRouteLayer(coreStore.map, routeSource)
	useMarkerLayer(coreStore.map, markerSource, route)

	function setupPlugin() {
		initializeDraw()
		// `pointerdown` handles mouse interaction while `focusin` handles keyboard
		// navigation (e.g. tabbing) away from the routing inputs.
		;(coreStore.shadowRoot as ShadowRoot).addEventListener(
			'pointerdown',
			updateFocus
		)
		;(coreStore.shadowRoot as ShadowRoot).addEventListener(
			'focusin',
			updateFocus
		)
	}

	function teardownPlugin() {
		;(coreStore.shadowRoot as ShadowRoot).removeEventListener(
			'pointerdown',
			updateFocus
		)
		;(coreStore.shadowRoot as ShadowRoot).removeEventListener(
			'focusin',
			updateFocus
		)

		reset()

		if (draw) {
			coreStore.unmaskInteraction('routing', 'click')
			draw = undefined
		}
	}

	function reset() {
		route.value = [[], []]
		routeAddressTexts.value = [null, null]
		routeInputValues.value = ['', '']
		routeSearchResults.value = [
			SearchResultSymbols.NO_SEARCH,
			SearchResultSymbols.NO_SEARCH,
		]
		routeSearchRequestCounters.value = [0, 0]
		currentlyFocusedInput.value = -1
		selectedPreference.value = 'recommended'
		selectedTravelMode.value = 'driving-car'
		selectedRouteTypesToAvoid.value = []
		routingResponseData.value = null
		routeSource.clear()
		markerSource.clear()

		if (abortController) {
			abortController.abort()
			abortController = null
		}
	}

	function setRoute(index: number, remove = false) {
		routeInputValues.value = remove
			? routeInputValues.value.toSpliced(index, 1)
			: routeInputValues.value.toSpliced(index, 0, '')
		routeSearchResults.value = remove
			? routeSearchResults.value.toSpliced(index, 1)
			: routeSearchResults.value.toSpliced(
					index,
					0,
					SearchResultSymbols.NO_SEARCH
				)
		routeSearchRequestCounters.value = remove
			? routeSearchRequestCounters.value.toSpliced(index, 1)
			: routeSearchRequestCounters.value.toSpliced(index, 0, 0)
		route.value = remove
			? route.value.toSpliced(index, 1)
			: route.value.toSpliced(index, 0, [])
		routeAddressTexts.value = remove
			? routeAddressTexts.value.toSpliced(index, 1)
			: routeAddressTexts.value.toSpliced(index, 0, null)
	}

	async function search(input: string) {
		const targetIndex =
			currentlyFocusedInput.value === -1 ? 0 : currentlyFocusedInput.value
		routeInputValues.value = routeInputValues.value.toSpliced(
			targetIndex,
			1,
			input
		)
		await searchForRouteInput(targetIndex, input, 'only')
	}

	function selectResult(feature: PolarGeoJsonFeature, categoryId = 'default') {
		const index = currentlyFocusedInput.value
		if (index < 0 || index >= route.value.length) {
			return
		}
		const searchResult = selectSearchResult(feature, undefined, categoryId)
		if (!searchResult) {
			return
		}
		addCoordinateToRoute(
			searchResult.feature.geometry.coordinates as Coordinate
		)
		routeInputValues.value = routeInputValues.value.toSpliced(
			index,
			1,
			searchResult.title
		)
		routeSearchResults.value = routeSearchResults.value.toSpliced(
			index,
			1,
			SearchResultSymbols.NO_SEARCH
		)
	}

	return {
		/**
		 * The coordinates selected by the user.
		 * If all coordinate pairs are filled, a route is requested.
		 */
		route,

		/**
		 * Reverse-geocoded address labels for each waypoint in {@link route}.
		 * `null` if no address was resolved (e.g. reverse geocoder not configured).
		 * @alpha
		 */
		routeAddressTexts,

		/**
		 * The response of the routing service depending on the {@link route} and
		 * other chosen options.
		 */
		routingResponseData,

		/**
		 * @alpha
		 */
		inputValue,

		/** @alpha */
		routeInputValues,

		/** @alpha */
		routeSearchResults,

		/** @alpha */
		selectedSearchGroupId,

		/** @alpha */
		focusAfterSearch,

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

		/** @alpha */
		setRouteInputValue,

		/** @alpha */
		selectResult,

		/** @alpha */
		search,

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

		/** @alpha @internal */
		showSearchResultList,

		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useRoutingStore, import.meta.hot))
}
