/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/routing/store
 */
/* eslint-enable tsdoc/syntax */

import type { Coordinate } from 'ol/coordinate'

import { t } from 'i18next'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useT } from '@/core/composables/useT.ts'

import { PluginId, type TravelMode } from './types.ts'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for routing.
 */
/* eslint-enable tsdoc/syntax */
export const useRoutingStore = defineStore('plugins/routing', () => {
	const route = ref<Coordinate[]>([[], []])
	const selectedTravelMode = ref('driving-car')

	const travelModes = computed<TravelMode[]>(() => [
		{
			value: 'driving-car',
			label: useT(() => t(($) => $.travelMode.car, { ns: PluginId })),
			icon: 'kern-icon--directions-car',
		},
		{
			value: 'driving-hgv',
			label: useT(() => t(($) => $.travelMode.hgv, { ns: PluginId })),
			icon: 'kern-icon--local-shipping',
		},
		{
			value: 'cycling-regular',
			label: useT(() => t(($) => $.travelMode.bike, { ns: PluginId })),
			icon: 'kern-icon--directions-bike',
		},
		{
			value: 'foot-walking',
			label: useT(() => t(($) => $.travelMode.walking, { ns: PluginId })),
			icon: 'kern-icon--directions-walk',
		},
		{
			value: 'wheelchair',
			label: useT(() => t(($) => $.travelMode.wheelchair, { ns: PluginId })),
			icon: 'kern-icon--accessible',
		},
	])

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
		selectedTravelMode,

		/**
		 * TODO(dopenguin)
		 */
		travelModes,

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
