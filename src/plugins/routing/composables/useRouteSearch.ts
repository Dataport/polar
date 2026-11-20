import type { Coordinate } from 'ol/coordinate'
import type { ComputedRef, Ref } from 'vue'
import type { PolarGeoJsonFeature, SearchResult } from '@/core'
import type { useCoreStore } from '@/core/stores'
import type { RoutingPluginOptions } from '../types'

import { t } from 'i18next'
import { computed, ref } from 'vue'

import SearchResultSymbols from '@/lib/searchResultSymbols'
import { selectSearchResult } from '@/lib/selectSearchResult'

import { PluginId } from '../types'
import { handleErrors } from '../utils/handleErrors'

interface RouteSearchOptions {
	addCoordinateToRoute: (
		coordinate: [number, number],
		userInput?: boolean
	) => Promise<void>
	configuration: ComputedRef<RoutingPluginOptions>
	coreStore: ReturnType<typeof useCoreStore>
	currentlyFocusedInput: Ref<number>
	route: Ref<Coordinate[]>
	routeInput: Ref<(string | null)[]>
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
	const rawRouteSearchResults = ref<(SearchResult[] | symbol)[]>([
		SearchResultSymbols.NO_SEARCH,
		SearchResultSymbols.NO_SEARCH,
	])
	const routeSearchRequestCounters = ref([0, 0])

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
	const routeSearchResults = computed(() =>
		rawRouteSearchResults.value.map((results) =>
			Array.isArray(results)
				? results.filter(
						(result) => result.groupId === selectedSearchGroupId.value
					)
				: results
		)
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
		const results = routeSearchResults.value[index]
		if (!Array.isArray(results)) {
			return ''
		}
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
		void searchForRouteInput(index, value)
	}

	function setRouteInputLoading(index: number, value: boolean) {
		routeInputLoading.value = routeInputLoading.value.toSpliced(index, 1, value)
	}

	async function searchForRouteInput(
		index: number,
		input: string,
		autoselect: 'first' | 'only' | 'never' = 'never'
	) {
		const addressSearch = addressSearchStore.value
		if (!showSearchResultList.value) {
			return
		}
		if (index < 0 || index >= route.value.length) {
			return
		}
		if (!addressSearch) {
			return
		}

		const currentCounter = (routeSearchRequestCounters.value[index] ?? 0) + 1
		routeSearchRequestCounters.value =
			routeSearchRequestCounters.value.toSpliced(index, 1, currentCounter)

		if (!input.trim().length || input.trim().length < addressSearch.minLength) {
			rawRouteSearchResults.value = rawRouteSearchResults.value.toSpliced(
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
				rawRouteSearchResults.value = rawRouteSearchResults.value.toSpliced(
					index,
					1,
					results
				)
			})
			.catch((error: unknown) => {
				if ((routeSearchRequestCounters.value[index] ?? 0) !== currentCounter) {
					return
				}
				rawRouteSearchResults.value = rawRouteSearchResults.value.toSpliced(
					index,
					1,
					SearchResultSymbols.NO_SEARCH
				)
				handleErrors(error)
			})
			.finally(() => {
				setRouteInputLoading(index, false)
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
		const firstFeature = firstFound.features.features[0]
		if (!firstFeature) {
			return
		}
		const featureCount = result.reduce(
			(count, { features }) => count + features.features.length,
			0
		)
		if (
			autoselect === 'first' ||
			(autoselect === 'only' && featureCount === 1)
		) {
			currentlyFocusedInput.value = index
			await selectResult(firstFeature, firstFound.categoryId)
		}
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
		await addCoordinateToRoute(
			searchResult.feature.geometry.coordinates as [number, number],
			true
		)
		routeInputValues.value = routeInputValues.value.toSpliced(
			index,
			1,
			searchResult.title
		)
		rawRouteSearchResults.value = rawRouteSearchResults.value.toSpliced(
			index,
			1,
			SearchResultSymbols.NO_SEARCH
		)
	}

	function resetSearch() {
		routeInputValues.value = ['', '']
		rawRouteSearchResults.value = [
			SearchResultSymbols.NO_SEARCH,
			SearchResultSymbols.NO_SEARCH,
		]
		routeSearchRequestCounters.value = [0, 0]
	}

	function setSearchWaypoint(index: number, remove: boolean) {
		routeInputValues.value = remove
			? routeInputValues.value.toSpliced(index, 1)
			: routeInputValues.value.toSpliced(index, 0, '')
		rawRouteSearchResults.value = remove
			? rawRouteSearchResults.value.toSpliced(index, 1)
			: rawRouteSearchResults.value.toSpliced(
					index,
					0,
					SearchResultSymbols.NO_SEARCH
				)
		routeSearchRequestCounters.value = remove
			? routeSearchRequestCounters.value.toSpliced(index, 1)
			: routeSearchRequestCounters.value.toSpliced(index, 0, 0)
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
		search,
		selectResult,
		resetSearch,
		setSearchWaypoint,
	}
}
