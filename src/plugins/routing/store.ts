/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/routing/store
 */
/* eslint-enable tsdoc/syntax */

import type { Coordinate } from 'ol/coordinate'

import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for routing.
 */
/* eslint-enable tsdoc/syntax */
export const useRoutingStore = defineStore('plugins/routing', () => {
	const route = ref<Coordinate[]>([[], []])

	function setupPlugin() {}

	function teardownPlugin() {}

	function setRoute(index: number, remove = false) {
		route.value = remove
			? route.value.toSpliced(index, 1)
			: route.value.toSpliced(index, 0, [])
	}

	return {
		/**
		 * TODO(dopenguin)
		 */
		route,

		/**
		 * TODO(dopenguin)
		 */
		setRoute,

		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useRoutingStore, import.meta.hot))
}
