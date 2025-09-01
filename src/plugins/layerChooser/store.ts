/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/layerChooser/store
 */
/* eslint-enable tsdoc/syntax */

import { defineStore } from 'pinia'
import { ref } from 'vue'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for the layer chooser.
 */
/* eslint-enable tsdoc/syntax */
export const useLayerChooserStore = defineStore('plugins/layerChooser', () => {
	const openedOptions = ref('')
	function setupPlugin() {}
	function teardownPlugin() {}

	return {
		/** @internal */
		openedOptions,
		/** @internal */
		setupPlugin,
		/** @internal */
		teardownPlugin,
	}
})
