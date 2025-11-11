/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/addressSearch/store
 */
/* eslint-enable tsdoc/syntax */

import debounce from 'just-debounce-it'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

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
		let abortController: AbortController | null = null
		let debouncedSearch: typeof _search

		const _inputValue = ref('')

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

		function setupPlugin() {
			// TODO: Implement waitMs getter from configuration
			debouncedSearch = debounce(_search, 300)
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
