/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/addressSearch/store
 */
/* eslint-enable tsdoc/syntax */

import { debounce, toMerged } from 'es-toolkit'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { SearchMethodConfiguration, SearchResult } from './types'
import { getResultsFromPromises } from './utils/getResultsFromPromises'
import SearchResultSymbols from './utils/searchResultSymbols'
import { getMethodContainer } from './utils/searchMethods/methodContainer'
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
		const searchMethods = ref<SearchMethodConfiguration[]>([])
		const searchResults = ref<SearchResult[] | symbol>([])

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

		function setupPlugin() {
			debouncedSearch = debounce(_search, waitMs.value)
			methodContainer = getMethodContainer()
			// TODO: Register customSearchMethods as callable ones to the methodContainer
			// TODO: Set both searchMethods to the state variable (it includes both custom and normal ones)
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
				// TODO: Remove loader
				return Promise.resolve()
			}
			// TODO: Show loader
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
							categoryId: categoryId || '',
							categoryLabel: '',
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
					// TODO: Remove loader
				})
		}

		// TODO: External method
		function search() {}

		return {
			inputValue,

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
