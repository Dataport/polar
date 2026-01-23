/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/addressSearch/store
 */
/* eslint-enable tsdoc/syntax */

import { debounce, toMerged } from 'es-toolkit'
import { t } from 'i18next'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { PolarGeoJsonFeature } from '@/core'

import { useCoreStore } from '@/core/stores'

import {
	type AddressSearchOptions,
	type GroupProperties,
	PluginId,
	type SearchResult,
	type SearchMethodConfiguration,
} from './types'
import { getResultsFromPromises } from './utils/getResultsFromPromises'
import { getMethodContainer } from './utils/methodContainer'
import SearchResultSymbols from './utils/searchResultSymbols'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for the address search.
 */
/* eslint-enable tsdoc/syntax */
export const useAddressSearchStore = defineStore(
	'plugins/addressSearch',
	() => {
		const coreStore = useCoreStore()

		const defaultGroupProperties: Required<GroupProperties> = {
			label: 'defaultLabel',
			hint: '',
			resultDisplayMode: 'mixed',
			limitResults: Number.MAX_SAFE_INTEGER,
		}

		let abortController: AbortController | null = null
		let debouncedSearch: ReturnType<typeof debounce<typeof _search>>
		let methodContainer: ReturnType<typeof getMethodContainer>

		const chosenAddress = ref<PolarGeoJsonFeature | null>(null)
		const _inputValue = ref('')
		const isLoading = ref(false)
		const searchResults = ref<SearchResult[] | symbol>(
			SearchResultSymbols.NO_SEARCH
		)
		const _selectedGroupId = ref('defaultGroup')

		const afterResultComponent = computed(
			() => configuration.value.afterResultComponent || null
		)
		const configuration = computed(
			() => coreStore.configuration.addressSearch as AddressSearchOptions
		)
		const inputValue = computed({
			get: () => _inputValue.value,
			set: (value) => {
				if (value === _inputValue.value) {
					return
				}
				_inputValue.value = value
				abortAndRequest()
			},
		})
		const featuresAvailable = computed(
			() =>
				Array.isArray(searchResults.value) &&
				searchResults.value.length > 0 &&
				searchResults.value.some(
					({ features: { features } }) =>
						Array.isArray(features) && features.length > 0
				)
		)
		const focusAfterSearch = computed(
			() => configuration.value.focusAfterSearch || false
		)
		const getGroupProperties = computed(
			() =>
				(groupId: string): GroupProperties => {
					const selectedGroupProperties =
						configuration.value.groupProperties?.[groupId] ||
						({} as GroupProperties)
					// defaultGroup is only one with predefined values
					return groupId === 'defaultGroup'
						? toMerged(defaultGroupProperties, selectedGroupProperties)
						: selectedGroupProperties
				}
		)
		const groupIds = computed(() => Object.keys(searchMethodsByGroupId.value))
		const groupSelectOptions = computed(() =>
			Object.keys(searchMethodsByGroupId.value).map((key) => ({
				groupId: key,
				text: getGroupProperties.value(key).label,
			}))
		)
		const hasMultipleGroups = computed(() => groupIds.value.length > 1)
		const hint = computed(() => {
			if (isLoading.value) {
				return t(($) => $.hint.loading, { ns: PluginId })
			}

			if (searchResults.value === SearchResultSymbols.ERROR) {
				return t(($) => $.hint.error, { ns: PluginId })
			}

			if (
				inputValue.value.length > 0 &&
				inputValue.value.length < minLength.value
			) {
				return t(($) => $.hint.tooShort, {
					ns: PluginId,
					minLength: minLength.value,
				})
			}

			if (
				searchResults.value !== SearchResultSymbols.NO_SEARCH &&
				!featuresAvailable.value
			) {
				return t(($) => $.hint.noResults, { ns: PluginId })
			}

			return selectedGroupProperties.value.hint || ''
		})
		const limitResults = computed(
			() =>
				selectedGroupProperties.value.limitResults ||
				defaultGroupProperties.limitResults
		)
		const minLength = computed(() =>
			typeof configuration.value.minLength === 'number'
				? configuration.value.minLength
				: 0
		)
		const searchMethodsByGroupId = computed<
			Record<string, SearchMethodConfiguration[]>
		>(() =>
			configuration.value.searchMethods.reduce((groups, searchMethod) => {
				const searchMethodName = searchMethod.groupId || 'defaultGroup'
				if (groups[searchMethodName]) {
					groups[searchMethodName].push(searchMethod)
				} else {
					groups[searchMethodName] = [searchMethod]
				}
				return groups
			}, {})
		)
		const selectedGroupId = computed({
			get: () => _selectedGroupId.value,
			set: (value) => {
				if (value === _selectedGroupId.value) {
					return
				}
				_selectedGroupId.value = value
				searchResults.value = SearchResultSymbols.NO_SEARCH
				if (inputValue.value.length > 0) {
					void _search()
				}
			},
		})
		const selectedGroupProperties = computed<GroupProperties>(() =>
			getGroupProperties.value(selectedGroupId.value)
		)
		const waitMs = computed(() =>
			typeof configuration.value.waitMs === 'number'
				? configuration.value.waitMs
				: 0
		)

		function setupPlugin() {
			debouncedSearch = debounce(_search, waitMs.value)
			methodContainer = getMethodContainer()
			selectedGroupId.value = groupIds.value[0] as string
			if (configuration.value.customSearchMethods) {
				// TODO: The method was bound to the store before, test with DISH if still required
				methodContainer.registerSearchMethods(
					configuration.value.customSearchMethods
				)
			}
		}

		function teardownPlugin() {}

		function abortAndRequest() {
			if (abortController) {
				abortController.abort()
				abortController = null
			}
			debouncedSearch()
		}

		function clear() {
			inputValue.value = ''
			searchResults.value = SearchResultSymbols.NO_SEARCH
			chosenAddress.value = null
		}

		function _search() {
			if (inputValue.value.length < minLength.value) {
				searchResults.value = SearchResultSymbols.NO_SEARCH
				isLoading.value = false
				return Promise.resolve()
			}
			isLoading.value = true
			abortController = new AbortController()
			const localAbortControllerReference = abortController
			return Promise.allSettled(
				configuration.value.searchMethods.map(
					async ({ categoryId, groupId, queryParameters, type, url }) => {
						const features = await methodContainer.getSearchMethod(type)(
							localAbortControllerReference.signal,
							url,
							inputValue.value,
							toMerged(queryParameters || {}, {
								epsg: coreStore.configuration.epsg,
							})
						)
						const id = categoryId || 'default'
						const properties = configuration.value.categoryProperties?.[id]
						return {
							categoryId: id,
							categoryLabel: properties
								? // @ts-expect-error | Other values can be used.
									t(properties.label)
								: t(($) => $.defaultLabel, { ns: PluginId }),
							features,
							groupId: groupId || 'defaultGroup',
						}
					}
				)
			)
				.then(
					(results) =>
						(searchResults.value = getResultsFromPromises(
							results,
							localAbortControllerReference
						))
				)
				.catch((error: unknown) => {
					console.error('An error occurred while searching.', error)
					searchResults.value = SearchResultSymbols.ERROR
				})
				.finally(() => {
					isLoading.value = false
				})
		}

		async function search(
			input: string,
			autoselect: 'first' | 'only' | 'never' = 'never'
		) {
			inputValue.value = input
			if (abortController) {
				abortController.abort()
				abortController = null
			}
			await _search()

			if (!Array.isArray(searchResults.value)) {
				// error or word too short, nothing to do
				return
			}

			const firstFound = searchResults.value.find(
				({ features }) => features.features.length
			)
			if (!firstFound) {
				// results are empty
				return
			}
			const firstFeatures = firstFound.features
				.features as PolarGeoJsonFeature[]

			if (
				(autoselect === 'first' && firstFeatures.length >= 1) ||
				(autoselect === 'only' && firstFeatures.length === 1)
			) {
				selectResult(
					firstFeatures[0] as PolarGeoJsonFeature,
					firstFound.categoryId
				)
			}
		}

		function selectResult(
			feature: PolarGeoJsonFeature,
			categoryId = 'default'
		) {
			const customMethod = configuration.value.customSelectResult?.[categoryId]
			if (customMethod) {
				customMethod(feature, categoryId)
			} else {
				chosenAddress.value = feature
				_inputValue.value = feature.title
				searchResults.value = SearchResultSymbols.NO_SEARCH
			}
		}

		return {
			/**
			 * Address GeoJSON object _as returned by a search service_.
			 * The result and its fields differ depending on the used backend.
			 * The callback is used whenever the user clicks on a search result or
			 * started a one-result search, which results in an auto-select of the
			 * singular result.
			 */
			chosenAddress,

			/** @internal */
			inputValue,

			/** @internal */
			afterResultComponent,

			/** @internal */
			focusAfterSearch,

			/** @internal */
			groupSelectOptions,

			/** @internal */
			hasMultipleGroups,

			/** @internal */
			isLoading,

			/**
			 * The results of the search sorted by searchMethod.
			 */
			searchResults,

			/**
			 * ID of the currently selected group.
			 * Changing this triggers a new search with the currently set value
			 * for {@link inputValue} if it has at least one character.
			 */
			selectedGroupId,

			/**
			 * `true` if any service yielded features.
			 *
			 * @internal
			 */
			featuresAvailable,

			/** @internal */
			hint,

			/** @internal */
			limitResults,

			/** @alpha */
			abortAndRequest,

			/** @alpha */
			clear,

			/**
			 * This function is solely meant for programmatic access and is not used by
			 * direct user input.
			 *
			 * @param input - Search string to be used.
			 * @param autoselect - Whether to automatically select a result. Defaults to `'never'` so that results will be presented as if the user searched for them. Using `'only'` will autoselect if a single result was returned; using `'first'` will autoselect the first of an arbitrary amount of results \>=1.
			 */
			search,

			/** @alpha */
			selectResult,

			/** @internal */
			setupPlugin,

			/** @internal */
			teardownPlugin,
		}
	}
)

if (import.meta.hot) {
	import.meta.hot.accept(
		acceptHMRUpdate(useAddressSearchStore, import.meta.hot)
	)
}
