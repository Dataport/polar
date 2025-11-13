/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/addressSearch/store
 */
/* eslint-enable tsdoc/syntax */

import debounce from 'just-debounce-it'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { SearchResult } from './types'
import { getMethodContainer } from './utils/searchMethods/methodContainer'
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
		let debouncedSearch: typeof _search
		let methodContainer: ReturnType<typeof getMethodContainer>

		const _inputValue = ref('')
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
		const waitMs = computed(() =>
			typeof coreStore.configuration.addressSearch?.waitMs === 'number'
				? coreStore.configuration.addressSearch.waitMs
				: 0
		)

		function setupPlugin() {
			debouncedSearch = debounce(_search, waitMs.value)
			methodContainer = getMethodContainer()
			// TODO: Register customSearchMethods as callable ones
			// TODO: Set both searchMethods and customSearchMethods to the state variable
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

		function _search() {}

		// TODO: External method
		function search() {}

		return {
			inputValue,
			abortAndRequest,
			clear,

			/** @internal */
			setupPlugin,

			/** @internal */
			teardownPlugin,
		}
	}
)
