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
import { useCoreStore } from '@/core/stores'

import {
	PluginId,
	type SelectableTravelMode,
	type TravelMode,
} from './types.ts'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for routing.
 */
/* eslint-enable tsdoc/syntax */
export const useRoutingStore = defineStore('plugins/routing', () => {
	const coreStore = useCoreStore()

	const route = ref<Coordinate[]>([[], []])
	const selectedPreference = ref('recommended')
	const selectedRouteTypesToAvoid = ref<string[]>([])
	const selectedTravelMode = ref('driving-car')

	const displayPreferences = computed(
		() => coreStore.configuration.routing?.displayPreferences || false
	)
	const selectablePreferences = computed(() =>
		['recommended', 'fastest', 'shortest'].map((value) => ({
			value,
			label: useT(() => t(($) => $.preference[value], { ns: PluginId })),
		}))
	)
	const displayRouteTypesToAvoid = computed(
		() => coreStore.configuration.routing?.displayRouteTypesToAvoid || false
	)
	const selectableRouteTypesToAvoid = computed(() =>
		selectedTravelMode.value === 'driving-car' ||
		selectedTravelMode.value === 'driving-hgv'
			? ['highways', 'tollways', 'ferries']
			: ['ferries']
	)
	const selectableTravelModes = computed<SelectableTravelMode[]>(
		() =>
			coreStore.configuration.routing?.selectableTravelModes || [
				'driving-car',
				'cycling-regular',
				'foot-walking',
			]
	)
	const travelModes = computed(() =>
		(
			[
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
					label: useT(() =>
						t(($) => $.travelMode.wheelchair, { ns: PluginId })
					),
					icon: 'kern-icon--accessible',
				},
			] as TravelMode[]
		).filter(({ value }) => selectableTravelModes.value.includes(value))
	)

	function setupPlugin() {}

	function teardownPlugin() {
		route.value = [[], []]
		selectedPreference.value = 'recommended'
		selectedTravelMode.value = 'driving-car'
		// TODO(dopenguin): The source of the route layer has to be reset as well
	}

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
		selectedPreference,

		/**
		 * TODO(dopenguin)
		 */
		selectedTravelMode,

		/**
		 * TODO(dopenguin)
		 */
		displayPreferences,

		/**
		 * TODO(dopenguin)
		 */
		selectablePreferences,

		/**
		 * TODO(dopenguin)
		 */
		displayRouteTypesToAvoid,

		/**
		 * TODO(dopenguin)
		 */
		selectedRouteTypesToAvoid,

		/**
		 * TODO(dopenguin)
		 */
		selectableRouteTypesToAvoid,

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
