/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/pins/store
 */
/* eslint-enable tsdoc/syntax */

import { defineStore } from 'pinia'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * TODO
 */
/* eslint-enable tsdoc/syntax */
export const usePinsStore = defineStore('plugins/pins', () => {
	function setupPlugin() {}
	function teardownPlugin() {}

	return {
		/** @internal */
		setupPlugin,
		/** @internal */
		teardownPlugin,
	}
})
