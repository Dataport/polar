/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/iconMenu/store
 */
/* eslint-enable tsdoc/syntax */

import { defineStore } from 'pinia'
import type { Reactive } from 'vue'
import { PluginId } from './types'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for the icon menu.
 */
/* eslint-enable tsdoc/syntax */
export const useIconMenuStore = defineStore('plugins/iconMenu', () => {
	function setupPlugin() {}

	function teardownPlugin() {}

	return {
		/** @internal */
		setupPlugin,
		/** @internal */
		teardownPlugin,
	}
})
