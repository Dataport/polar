import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed } from 'vue'

import { useCoreStore } from '@/core/stores'

import { PluginId, type GfiPluginOptions } from '../types'

export const useGfiMainStore = defineStore('plugins/gfi/main', () => {
	const coreStore = useCoreStore()

	const configuration = computed(
		() => coreStore.configuration[PluginId] as GfiPluginOptions
	)

	function getLayerConfiguration(layerId: string) {
		return configuration.value.layers[layerId]
	}

	return {
		configuration,
		getLayerConfiguration,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useGfiMainStore, import.meta.hot))
}
