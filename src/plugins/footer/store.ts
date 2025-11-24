/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/footer/store
 */
/* eslint-enable tsdoc/syntax */

import { acceptHMRUpdate, defineStore } from 'pinia'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for the footer.
 */
/* eslint-enable tsdoc/syntax */
export const useFooterStore = defineStore('plugins/footer', () => {
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
	import.meta.hot.accept(acceptHMRUpdate(useFooterStore, import.meta.hot))
}
