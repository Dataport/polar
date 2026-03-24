/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/filter/store
 */
/* eslint-enable tsdoc/syntax */

import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { watch } from 'vue'

import { getVectorSource } from '@/lib/getVectorSource'

import { useFilterMainStore } from './stores/main'
import { useFilterTimeStore } from './stores/time'
import { updateFeatureVisibility } from './utils/updateFeatureVisibility'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for filtering features.
 */
/* eslint-enable tsdoc/syntax */
export const useFilterStore = defineStore('plugins/filter', () => {
	const filterMainStore = useFilterMainStore()
	const filterMainStoreRefs = storeToRefs(filterMainStore)
	const filterTimeStore = useFilterTimeStore()
	const filterTimeStoreRefs = storeToRefs(filterTimeStore)

	const teardownCallbacks = [] as (() => void)[]

	function setupPlugin() {
		filterMainStore.filteredLayers.forEach((layer) => {
			const source = getVectorSource(layer)
			const callback = () => {
				updateFeatureVisibility(
					source,
					filterMainStore.state[layer.get('id')] ?? {}
				)
			}
			source.on('featuresloadend', callback)
			teardownCallbacks.push(() => {
				source.un('featuresloadend', callback)
			})
			teardownCallbacks.push(
				watch(
					() => filterMainStore.state[layer.get('id')],
					() => {
						callback()
					},
					{ deep: true, immediate: true }
				)
			)
		})
	}

	function teardownPlugin() {
		teardownCallbacks.forEach((callback) => {
			callback()
		})
	}

	return {
		/**
		 * Flat list of filterable layers.
		 *
		 * @alpha
		 */
		layers: filterMainStoreRefs.layers,

		/**
		 * ID of the selected layer.
		 *
		 * @alpha
		 */
		selectedLayerId: filterMainStoreRefs.selectedLayerId,

		/**
		 * Information on the selected layer.
		 *
		 * @alpha
		 */
		selectedLayer: filterMainStoreRefs.selectedLayer,

		/**
		 * Configuration of the selected layer w.r.t. filter.
		 * If no layer is selected, the configuration is an empty object.
		 *
		 * @alpha
		 */
		selectedLayerConfiguration: filterMainStoreRefs.selectedLayerConfiguration,

		/**
		 * State of the selected layer w.r.t. filter.
		 * If no layer is selected, the state is `null`.
		 *
		 * @alpha
		 */
		selectedLayerState: filterMainStoreRefs.selectedLayerState,

		/**
		 * `true` if the selected layer allows filtering for time.
		 *
		 * @alpha
		 */
		selectedLayerHasTimeFilter: filterMainStoreRefs.selectedLayerHasTimeFilter,

		/**
		 * @alpha
		 */
		timeModel: filterTimeStoreRefs.model,

		/**
		 * @alpha
		 */
		timeStart: filterTimeStoreRefs.customModelStart,

		/**
		 * @alpha
		 */
		timeEnd: filterTimeStoreRefs.customModelEnd,

		/**
		 * @alpha
		 */
		timeConstraints: filterTimeStoreRefs.timeConstraints,

		/**
		 * @alpha
		 */
		timeItems: filterTimeStoreRefs.items,

		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useFilterStore, import.meta.hot))
}
