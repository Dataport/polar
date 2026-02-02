/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/filter/store
 */
/* eslint-enable tsdoc/syntax */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import { useCoreStore } from '@/core/stores'
import { getVectorSource } from '@/lib/getVectorSource'

import { PluginId, type FilterPluginOptions, type FilterState } from './types'
import { updateFeatureVisibility } from './utils/updateFeatureVisibility'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for filtering features.
 */
/* eslint-enable tsdoc/syntax */
export const useFilterStore = defineStore('plugins/filter', () => {
	const coreStore = useCoreStore()

	const configuration = computed(
		() =>
			(coreStore.configuration[PluginId] ?? {
				layers: {},
			}) as FilterPluginOptions
	)

	const state = ref<Record<string, FilterState>>({})

	const filteredLayers = computed(() =>
		coreStore.map
			.getAllLayers()
			.filter((layer) =>
				Object.keys(configuration.value.layers).includes(layer.get('id'))
			)
	)

	const teardownCallbacks = [] as (() => void)[]

	function setupPlugin() {
		filteredLayers.value.forEach((layer) => {
			const source = getVectorSource(layer)
			const callback = () => {
				updateFeatureVisibility(source, state.value[layer.get('id')] ?? {})
			}
			source.on('featuresloadend', callback)
			teardownCallbacks.push(() => {
				source.un('featuresloadend', callback)
			})
			teardownCallbacks.push(
				watch(
					() => state.value[layer.get('id')],
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
		/** @internal */
		configuration,

		/** @internal */
		state,

		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useFilterStore, import.meta.hot))
}
