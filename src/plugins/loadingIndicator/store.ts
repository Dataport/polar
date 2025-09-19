/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/loadingIndicator/store
 */
/* eslint-enable tsdoc/syntax */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for the loading indicator.
 */
/* eslint-enable tsdoc/syntax */
export const useLoadingIndicatorStore = defineStore(
	'plugins/loadingIndicator',
	() => {
		const loaderStyle = ref('kern-loader')
		const loaderIsShown = computed(() => {})

		function setupPlugin() {}
		function teardownPlugin() {}

		function addLoadingKey(key: string) {}

		function removeLoadingKey(key: string) {}

		function setLoaderStyle(loaderStyle: string) {}

		return {
			/** The current loader style. */
			loaderStyle,
			/** Whether the layer is currently shown. */
			loaderIsShown,
			/**
			 * Adds a loading indicator with the given `key`.
			 *
			 * The `key` is a unique identifier used to keep track of the added loader
			 * via a Set. It can't be added multiple times, and removing it once always
			 * removes it altogether.
			 *
			 * The LoadingIndicator will usually be used for asynchronous code.
			 *
			 * @remarks
			 * It is advised to use a key like `{my-plugin-or-application-name}-{procedure-name}`
			 * to avoid name conflicts.
			 */
			addLoadingKey,
			/**
			 * Removes the loading indicator with the given `key`.
			 *
			 * @remarks
			 * This function **always has to be called in the `finally` section of your code**
			 * to prevent hanging loading indicators.
			 */
			removeLoadingKey,
			/** Change the loader style at runtime. */
			setLoaderStyle,
			/** @internal */
			setupPlugin,
			/** @internal */
			teardownPlugin,
		}
	}
)
