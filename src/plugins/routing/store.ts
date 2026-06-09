/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/routing/store
 */
/* eslint-enable tsdoc/syntax */

import { acceptHMRUpdate, defineStore } from 'pinia'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for routing.
 */
/* eslint-enable tsdoc/syntax */
export const useRoutingStore = defineStore('plugins/routing', () => {
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
	import.meta.hot.accept(acceptHMRUpdate(useRoutingStore, import.meta.hot))
}
