/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/addressSearch/store
 */
/* eslint-enable tsdoc/syntax */

import { debounce, toMerged } from 'es-toolkit'
import { t } from 'i18next'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { type AddressSearchOptions, PluginId, type SearchResult } from './types'
import { getMethodContainer } from './utils/methodContainer'
import { getResultsFromPromises } from './utils/getResultsFromPromises'
import SearchResultSymbols from './utils/searchResultSymbols'
import { useCoreStore } from '@/core/stores/export'

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

		let abortController: AbortController | null = null
		let debouncedSearch: ReturnType<typeof debounce<typeof _search>>
		let methodContainer: ReturnType<typeof getMethodContainer>

		const _inputValue = ref('')
		const isLoading = ref(false)
		const searchResults = ref<SearchResult[] | symbol>(
			SearchResultSymbols.NO_SEARCH
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

			return ''
			// TODO: Check if needed
			// return selectedGroupHint
		})
		const minLength = computed(() =>
			typeof coreStore.configuration.addressSearch?.minLength === 'number'
				? coreStore.configuration.addressSearch.minLength
				: 0
		)

		const waitMs = computed(() =>
			typeof coreStore.configuration.addressSearch?.waitMs === 'number'
				? coreStore.configuration.addressSearch.waitMs
				: 0
		)
		const searchMethods = computed(
			() =>
				(coreStore.configuration.addressSearch as AddressSearchOptions)
					.searchMethods
		)

		function setupPlugin() {
			debouncedSearch = debounce(_search, waitMs.value)
			methodContainer = getMethodContainer()
			// TODO: Register customSearchMethods as callable ones to the methodContainer
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
			// TODO: Reset chosenAddress (chosen feature)
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
				// TODO: IF groups are to be implemented, the searchMethods should be retrieved from the group
				searchMethods.value.map(
					async ({ categoryId, queryParameters, type, url }) => {
						const features = await methodContainer.getSearchMethod(type)(
							localAbortControllerReference.signal,
							url,
							inputValue.value,
							toMerged(queryParameters || {}, {
								epsg: coreStore.configuration.epsg,
							})
						)
						return {
							// TODO: Add information, that the defaulted categoryId is 'default'
							categoryId: categoryId || 'default',
							// TODO: Add information, that this is the defaulted label and this can be configured similar to categoryId
							categoryLabel: t(($) => $.defaultCategory, { ns: PluginId }),
							features,
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

		// TODO: External method
		function search() {}

		return {
			inputValue,

			/** @internal */
			isLoading,

			searchResults,

			/**
			 * `true` if any service yielded features.
			 *
			 * @internal
			 */
			featuresAvailable,

			/** @internal */
			hint,

			/** @alpha */
			abortAndRequest,

			/** @alpha */
			clear,
			search,

			/** @internal */
			setupPlugin,

			/** @internal */
			teardownPlugin,
		}
	}
)
