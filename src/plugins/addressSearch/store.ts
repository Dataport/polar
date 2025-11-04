/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/addressSearch/store
 */
/* eslint-enable tsdoc/syntax */

import { defineStore } from 'pinia'

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
		function setupPlugin() {}

		function teardownPlugin() {}

		return {
			/** @internal */
			setupPlugin,

			/** @internal */
			teardownPlugin,
		}
	}
)
