import type { Coordinate } from 'ol/coordinate'
import type { Extent } from 'ol/extent'
import type { ComputedRef, Ref } from 'vue'
import type { PolarGeoJsonFeature, SearchResult } from '@/core'
import type { useCoreStore } from '@/core/stores'
import type { RoutingPluginOptions } from '../types'

import { t } from 'i18next'
import { containsCoordinate } from 'ol/extent'
import { transform } from 'ol/proj'
import { computed, ref } from 'vue'

import SearchResultSymbols from '@/lib/searchResultSymbols'
import { selectSearchResult } from '@/lib/selectSearchResult'

import { PluginId } from '../types'
import { handleErrors } from '../utils/handleErrors'

interface RouteSearchOptions {
	addCoordinateToRoute: (
		coordinate: [number, number],
		userInput?: boolean,
		index?: number
	) => Promise<void>
	configuration: ComputedRef<RoutingPluginOptions>
	coreStore: ReturnType<typeof useCoreStore>
	currentlyFocusedInput: Ref<number>
	route: Ref<Coordinate[]>
	routeInput: Ref<(string | null)[]>
}

function isInExtent(coordinate: Coordinate, extent?: Extent) {
	return !extent || containsCoordinate(extent, coordinate)
}

export function useRouteSearch({
	coreStore,
	configuration,
	route,
	routeInput,
	currentlyFocusedInput,
	addCoordinateToRoute,
}: RouteSearchOptions) {
	const routeInputValues = ref(['', ''])
	const routeInputLoading = ref<boolean[]>([false, false])
	const routeSearchResults = ref<(SearchResult[] | symbol)[]>([
		SearchResultSymbols.NO_SEARCH,
		SearchResultSymbols.NO_SEARCH,
	])
	const routeSearchRequestCounters = ref([0, 0])
	const routeInputInvalid = ref([false, false])
	let requestCounter = 0

	function isCoordinateInput(input: string) {
		return (
			/^[\d\s.,+\-()[\]]+$/.test(input) ||
			(input.includes(',') &&
				input
					.split(',')
					.every(
						(part) =>
							/^[[(]*[+-]?(?:\d|\.\d|Infinity|NaN|$)/.test(part.trim()) &&
							!/\s/.test(part.trim())
					))
		)
	}

	function invalidateSearch(index: number) {
		routeSearchRequestCounters.value[index] = ++requestCounter
		routeSearchResults.value[index] = SearchResultSymbols.NO_SEARCH
		routeInputLoading.value[index] = false
	}

	function resetRouteInput(index: number) {
		invalidateSearch(index)
		routeInputValues.value[index] = ''
		routeInputInvalid.value[index] = false
	}

	async function commitRouteInput(index: number) {
		const input = routeInputValues.value[index]?.trim() ?? ''
		if (!isCoordinateInput(input) || index < 0 || index >= route.value.length) {
			return
		}
		invalidateSearch(index)
		const parts = input.split(',').map((part) => part.trim())
		const [x, y] = parts.map(Number)
		const numberPattern = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/
		if (
			parts.length !== 2 ||
			!parts.every((part) => numberPattern.test(part)) ||
			x === undefined ||
			y === undefined ||
			!Number.isFinite(x) ||
			!Number.isFinite(y)
		) {
			routeInputInvalid.value[index] = true
			return
		}
		const coordinate: [number, number] = [x, y]
		const projection = coreStore.map.getView().getProjection()
		const projectionExtent = projection.getExtent()
		const extent = coreStore.configuration.extent
		try {
			const geographic = transform(coordinate, projection, 'EPSG:4326')
			if (
				!isInExtent(coordinate, projectionExtent) ||
				!isInExtent(coordinate, extent) ||
				!geographic.every(Number.isFinite) ||
				!isInExtent(geographic, projection.getWorldExtent()) ||
				!isInExtent(geographic, [-180, -90, 180, 90])
			) {
				routeInputInvalid.value[index] = true
				return
			}
			await addCoordinateToRoute(coordinate, false, index)
		} catch (error) {
			routeInputInvalid.value[index] = true
			handleErrors(error)
		}
	}

	const addressSearchStore = computed(() =>
		coreStore.getPluginStore('addressSearch')
	)
	const showSearchResultList = computed(
		() =>
			coreStore.usedPlugins.includes('reverseGeocoder') &&
			coreStore.usedPlugins.includes('addressSearch')
	)
	const focusAfterSearch = computed(
		() => coreStore.configuration.addressSearch?.focusAfterSearch ?? false
	)
	const selectedSearchGroupId = computed(
		() => configuration.value.searchGroupId ?? 'defaultGroup'
	)

	const searchResultHint = computed((): string | undefined => {
		const index = currentlyFocusedInput.value
		const addressSearch = addressSearchStore.value
		if (!showSearchResultList.value) {
			return ''
		}
		if (!addressSearch) {
			return ''
		}
		const input = routeInputValues.value[index]?.trim() ?? ''
		if (input.length === 0) {
			return t(($) => $.hint.empty, { ns: PluginId })
		}
		if (input.length < addressSearch.minLength) {
			return t(($) => $.hint.tooShort, {
				minLength: addressSearch.minLength,
				ns: PluginId,
			})
		}
		if (routeSearchResults.value[index] === SearchResultSymbols.ERROR) {
			return t(($) => $.hint.error, { ns: PluginId })
		}
		if (routeInputLoading.value[index]) {
			return t(($) => $.hint.loading, { ns: PluginId })
		}
		if (!Array.isArray(routeSearchResults.value[index])) {
			return ''
		}
		const results = routeSearchResults.value[index].filter(
			(group) => group.groupId === selectedSearchGroupId.value
		)
		if (
			!results.some(
				(group) =>
					Array.isArray(group.features.features) &&
					group.features.features.length > 0
			)
		) {
			return t(($) => $.hint.noResults, { ns: PluginId })
		}
	})

	function setRouteInputValue(index: number, value: string) {
		if (index < 0 || index >= route.value.length) {
			return
		}
		routeInputValues.value = routeInputValues.value.toSpliced(index, 1, value)
		routeInput.value = routeInput.value.toSpliced(index, 1, null)
		routeInputInvalid.value[index] = false
		if (isCoordinateInput(value.trim())) {
			invalidateSearch(index)
		} else {
			void searchForRouteInput(index, value)
		}
	}

	function setRouteInputLoading(index: number, value: boolean) {
		routeInputLoading.value = routeInputLoading.value.toSpliced(index, 1, value)
	}

	async function searchForRouteInput(
		index: number,
		input: string,
		autoselect: 'first' | 'only' | 'never' = 'never'
	) {
		if (index < 0 || index >= route.value.length) {
			return
		}
		invalidateSearch(index)
		const currentCounter = routeSearchRequestCounters.value[index]
		const addressSearch = addressSearchStore.value
		if (!showSearchResultList.value) {
			return
		}
		if (!addressSearch) {
			return
		}

		if (!input.trim().length || input.trim().length < addressSearch.minLength) {
			routeSearchResults.value = routeSearchResults.value.toSpliced(
				index,
				1,
				SearchResultSymbols.NO_SEARCH
			)
			return
		}
		setRouteInputLoading(index, true)

		await addressSearch
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
			.catch((error: unknown) => {
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
			.finally(() => {
				if (routeSearchRequestCounters.value[index] === currentCounter) {
					setRouteInputLoading(index, false)
				}
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
			await selectResult(
				firstFeatures[0] as PolarGeoJsonFeature,
				firstFound.categoryId
			)
		}
	}

	async function search(input: string) {
		const targetIndex =
			currentlyFocusedInput.value === -1 ? 0 : currentlyFocusedInput.value
		if (targetIndex < 0 || targetIndex >= route.value.length) {
			return
		}
		routeInputValues.value = routeInputValues.value.toSpliced(
			targetIndex,
			1,
			input
		)
		routeInput.value[targetIndex] = null
		routeInputInvalid.value[targetIndex] = false
		if (isCoordinateInput(input.trim())) {
			await commitRouteInput(targetIndex)
			return
		}
		await searchForRouteInput(targetIndex, input, 'only')
	}

	async function selectResult(
		feature: PolarGeoJsonFeature,
		categoryId = 'default'
	) {
		const index = currentlyFocusedInput.value
		if (index < 0 || index >= route.value.length) {
			return
		}
		const searchResult = selectSearchResult(feature, undefined, categoryId)
		if (!searchResult) {
			return
		}
		const insertion = addCoordinateToRoute(
			searchResult.feature.geometry.coordinates as [number, number],
			true,
			index
		)
		const currentCounter = routeSearchRequestCounters.value[index]
		await insertion
		if (routeSearchRequestCounters.value[index] !== currentCounter) {
			return
		}
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

	function resetSearch() {
		routeInputValues.value = ['', '']
		routeSearchResults.value = [
			SearchResultSymbols.NO_SEARCH,
			SearchResultSymbols.NO_SEARCH,
		]
		routeSearchRequestCounters.value = [++requestCounter, ++requestCounter]
		routeInputLoading.value = [false, false]
		routeInputInvalid.value = [false, false]
	}

	function setSearchWaypoint(index: number, remove: boolean) {
		routeInputInvalid.value = remove
			? routeInputInvalid.value.toSpliced(index, 1)
			: routeInputInvalid.value.toSpliced(index, 0, false)
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
		routeSearchRequestCounters.value = routeInputValues.value.map(
			() => ++requestCounter
		)
		routeInputLoading.value = routeInputValues.value.map(() => false)
	}

	return {
		routeInputValues,
		routeInputLoading,
		routeSearchResults,
		showSearchResultList,
		focusAfterSearch,
		selectedSearchGroupId,
		searchResultHint,
		setRouteInputValue,
		commitRouteInput,
		resetRouteInput,
		routeInputInvalid,
		search,
		selectResult,
		resetSearch,
		setSearchWaypoint,
	}
}
