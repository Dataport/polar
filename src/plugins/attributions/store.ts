/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/attributions/store
 */
/* eslint-enable tsdoc/syntax */

import type { StoreReference } from '@/core'
import type { Attribution } from './types'

import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { usePluginStoreWatcher } from '@/composables/usePluginStoreWatcher'
import { useCoreStore } from '@/core/stores'

import { buildMapInfo } from './utils/buildMapInfo'
import { formatAttributionText } from './utils/formatAttributionText'
import { getVisibleAttributions } from './utils/getVisibleAttributions.ts'
import { getVisibleLayers } from './utils/getVisibleLayers'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for the attributions.
 */
/* eslint-enable tsdoc/syntax */
export const useAttributionsStore = defineStore('plugins/attributions', () => {
	const coreStore = useCoreStore()

	const attributions = ref([] as Attribution[])
	const layers = ref<string[]>([])
	const windowIsOpen = ref(false)

	const configuration = computed(
		() => coreStore.configuration.attributions || {}
	)
	const mapInfo = computed(() =>
		buildMapInfo(
			getVisibleAttributions(layers.value, attributions.value),
			staticAttributions.value
		)
	)
	const listenToChanges = computed<StoreReference[]>(
		() => configuration.value.listenToChanges || []
	)
	const mapInfoIcon = computed(() =>
		windowIsOpen.value
			? (configuration.value.icons?.close ?? 'kern-icon--chevron-forward')
			: (configuration.value.icons?.open ?? 'kern-icon-fill--copyright')
	)
	const renderType = computed(
		() => configuration.value.renderType || 'independent'
	)
	const staticAttributions = computed(() =>
		(configuration.value.staticAttributions || []).map(formatAttributionText)
	)
	const windowWidth = computed(() => configuration.value.windowWidth || 500)

	usePluginStoreWatcher(listenToChanges, updateLayers)

	function setupPlugin() {
		const allLayers = coreStore.map.getLayers()
		allLayers.on('add', updateLayers)
		allLayers.on('add', updateAttributions)
		allLayers.on('change', updateLayers)
		coreStore.map.on('moveend', updateLayers)

		updateLayers()
		updateAttributions()

		if (
			configuration.value.initiallyOpen &&
			renderType.value === 'independent'
		) {
			windowIsOpen.value = true
		}
	}

	function teardownPlugin() {
		const allLayers = coreStore.map.getLayers()
		allLayers.un('add', updateLayers)
		allLayers.un('add', updateAttributions)
		allLayers.un('change', updateLayers)
		coreStore.map.un('moveend', updateLayers)
	}

	function updateAttributions() {
		attributions.value =
			configuration.value.layerAttributions === undefined
				? []
				: configuration.value.layerAttributions.map((a) => ({
						...a,
						title: formatAttributionText(a.title),
					}))
	}

	function updateLayers() {
		layers.value = getVisibleLayers(coreStore.map.getLayers())
	}

	return {
		/**
		 * Only relevant if the plugin controls the toggling of the window itself.
		 * @internal
		 */
		windowIsOpen,

		/** @internal */
		configuration,

		/** @internal */
		mapInfo,

		/** @internal */
		mapInfoIcon,

		/** @internal */
		renderType,

		/** @internal */
		windowWidth,

		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useAttributionsStore, import.meta.hot))
}
