import { defineStore } from 'pinia'
import { computed } from 'vue'

import { useCoreStore } from '@/core/stores'

export const useInitialViewStore = defineStore('plugins/initialView', () => {
	const coreStore = useCoreStore()

	const startCenter = computed(() => coreStore.configuration.startCenter)

	const startResolution = computed(
		() => coreStore.configuration.startResolution
	)

	function returnToInitialView() {
		coreStore.map.getView().setCenter(startCenter.value)
		coreStore.map.getView().setResolution(startResolution.value)
	}

	function setupPlugin() {}

	function teardownPlugin() {}

	return {
		startCenter,
		startResolution,

		/** @alpha  */

		returnToInitialView,
		setupPlugin,
		teardownPlugin,
	}
})
