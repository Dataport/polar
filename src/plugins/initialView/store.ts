import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useCoreStore } from '@/core/stores'

export const useInitialViewStore = defineStore('plugins/initialView', () => {
	const coreStore = useCoreStore()

	const viewCenter = coreStore.map.getView().getCenter() as
		[number, number] | undefined
	const viewResolution = coreStore.map.getView().getResolution()

	const initialCenter = coreStore.configuration.returnToInitialView
		?.startCenter ??
		viewCenter ?? [0, 0]

	const initialResolution =
		coreStore.configuration.returnToInitialView?.startResolution ??
		viewResolution ??
		1

	const startCenter = ref(initialCenter)
	const startResolution = ref(initialResolution)

	function returnToInitialView() {
		coreStore.map.getView().setCenter(startCenter.value)
		coreStore.map.getView().setResolution(startResolution.value)
	}

	function setupPlugin() {
		const options = coreStore.configuration.returnToInitialView
		if (options?.startCenter) {
			startCenter.value = options.startCenter
		}
		if (options?.startResolution) {
			startResolution.value = options.startResolution
		}
	}

	function teardownPlugin() {}

	return {
		startCenter,
		startResolution,
		returnToInitialView,
		setupPlugin,
		teardownPlugin,
	}
})
