/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/attributions/store
 */
/* eslint-enable tsdoc/syntax */

import { acceptHMRUpdate, defineStore } from 'pinia'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for the attributions.
 */
/* eslint-enable tsdoc/syntax */
export const useAttributionsStore = defineStore('plugins/attributions', () => {
	function setupPlugin() {}

	function teardownPlugin() {}

	return {
		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useAttributionsStore, import.meta.hot))
}
